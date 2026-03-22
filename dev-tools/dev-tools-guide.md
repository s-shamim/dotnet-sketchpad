# dev-tools — Implementation Guide

## Architecture Overview

Folder-based app: `dev-tools/`

All logic lives in `App.cs` as API endpoints. The UI (`script.jsx` or multi-file JSX) only calls
these endpoints and renders the response. No logic, parsing, or transformation happens in the
frontend.

```
dev-tools/
  App.cs
  app.run.json          ← port 5100
  appsettings.json
  wwwroot/
    index.html
    app.jsx             ← root, shared helpers, nav
    converters/
      JsonYaml.jsx
      JsonCsv.jsx
      UnixTimestamp.jsx
      Base64Text.jsx
      NumberBase.jsx
      ColorCode.jsx
    encoders/
      UrlEncoderDecoder.jsx
      HtmlEncoderDecoder.jsx
      JwtEncoderDecoder.jsx
      MorseCode.jsx
    formatters/
      JsonFormatter.jsx
      XmlFormatter.jsx
      CsvFormatter.jsx
      SqlFormatter.jsx
      JsonStringify.jsx
      DiffChecker.jsx
    validators/
      JsonValidator.jsx
      XmlValidator.jsx
      RegexValidator.jsx
      JsonSchemaValidator.jsx
      IpValidator.jsx
      CronValidator.jsx
    generators/
      LoremIpsum.jsx
      Password.jsx
      Uuid.jsx
      QrCode.jsx
      HashGenerator.jsx
      FakeData.jsx
      JwtGenerator.jsx
      JwtSchemaGen.jsx
    cryptography/
      AesEncryptDecrypt.jsx
    text/
      WordCounter.jsx
      CaseConverter.jsx
      StringEscape.jsx
      WhitespaceCleaner.jsx
      Slugify.jsx
```

---

## App.cs — NuGet Packages

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package YamlDotNet@16.*
#:package CsvHelper@33.*
#:package System.Text.Json@9.*
#:package Microsoft.IdentityModel.JsonWebTokens@8.*
#:package QRCoder@1.*
#:package Bogus@35.*
#:package SqlFormatter@1.*
#:package BCrypt.Net-Next@4.*
```

---

## API Design Convention

Every endpoint follows the same shape:

```
POST /api/{category}/{tool}
Body: { "input": "...", "options": { ... } }
Response: { "output": "...", "error": null }
         or { "output": null, "error": "message" }
```

Always return HTTP 200. Put errors inside the JSON body — the UI checks `error` and shows it
inline. Never throw 400/500 from tool endpoints.

```csharp
record ToolRequest(string Input, Dictionary<string, string>? Options = null);
record ToolResponse(string? Output, string? Error);

// Helper used by every endpoint
ToolResponse Ok(string output) => new(output, null);
ToolResponse Err(string msg)   => new(null, msg);
```

---

## Section 1 — Converters

### 1.1 JSON ↔ YAML

**Packages:** `YamlDotNet`

```csharp
app.MapPost("/api/converters/json-to-yaml", (ToolRequest req) => {
    try {
        var obj = JsonSerializer.Deserialize<object>(req.Input);
        var serializer = new YamlDotNet.Serialization.SerializerBuilder().Build();
        return Ok(serializer.Serialize(obj));
    } catch (Exception ex) { return Err(ex.Message); }
});

app.MapPost("/api/converters/yaml-to-json", (ToolRequest req) => {
    try {
        var deserializer = new YamlDotNet.Serialization.DeserializerBuilder().Build();
        var obj = deserializer.Deserialize<object>(req.Input);
        return Ok(JsonSerializer.Serialize(obj, new JsonSerializerOptions { WriteIndented = true }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI:** Two textareas side by side. Direction toggle (JSON→YAML / YAML→JSON). On input change
(debounced 300ms), call the appropriate endpoint and render output.

---

### 1.2 JSON ↔ CSV

**Packages:** `CsvHelper`, `System.Text.Json`

**JSON → CSV logic:**
1. Deserialize JSON as `List<JsonObject>`.
2. Collect all unique keys across all objects (preserve insertion order of first object).
3. Write header row, then one row per object. Missing keys → empty cell.

**CSV → JSON logic:**
1. Use `CsvReader` to parse records into `List<Dictionary<string, string>>`.
2. Serialize as pretty-printed JSON array.

```csharp
app.MapPost("/api/converters/json-to-csv", (ToolRequest req) => {
    try {
        var rows = JsonSerializer.Deserialize<List<JsonObject>>(req.Input)!;
        var headers = rows.SelectMany(r => r.Select(kv => kv.Key)).Distinct().ToList();
        var sb = new StringBuilder();
        sb.AppendLine(string.Join(",", headers.Select(CsvEscape)));
        foreach (var row in rows)
            sb.AppendLine(string.Join(",", headers.Select(h =>
                CsvEscape(row.TryGetPropertyValue(h, out var v) ? v?.ToString() ?? "" : ""))));
        return Ok(sb.ToString().TrimEnd());
    } catch (Exception ex) { return Err(ex.Message); }
});

// CsvEscape: wrap in quotes if value contains comma, newline, or quote. Double inner quotes.
```

---

### 1.3 Unix Timestamp ↔ DateTime (IST focus)

No NuGet package needed — use `DateTimeOffset` from BCL.

**Options accepted:**
- `timezone`: IANA timezone string, default `"Asia/Kolkata"` (IST = UTC+5:30)
- `direction`: `"toDatetime"` or `"toUnix"`

```csharp
app.MapPost("/api/converters/timestamp", (ToolRequest req) => {
    var tz = req.Options?.GetValueOrDefault("timezone") ?? "Asia/Kolkata";
    var dir = req.Options?.GetValueOrDefault("direction") ?? "toDatetime";
    try {
        var tzi = TimeZoneInfo.FindSystemTimeZoneById(tz);
        if (dir == "toDatetime") {
            var unix = long.Parse(req.Input.Trim());
            var utc  = DateTimeOffset.FromUnixTimeSeconds(unix).UtcDateTime;
            var local = TimeZoneInfo.ConvertTimeFromUtc(utc, tzi);
            return Ok($"{local:yyyy-MM-dd HH:mm:ss} ({tz}, UTC{tzi.GetUtcOffset(utc):hhmm})");
        } else {
            var dt  = DateTime.Parse(req.Input.Trim());
            var utc = TimeZoneInfo.ConvertTimeToUtc(dt, tzi);
            return Ok(((DateTimeOffset)utc).ToUnixTimeSeconds().ToString());
        }
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI extras:** Show current Unix timestamp live (updates every second in JS). Dropdown of
common timezones (IST pre-selected). Copy button on output.

---

### 1.4 Base64 ↔ Text

Pure BCL — no packages.

```csharp
app.MapPost("/api/converters/base64-encode", (ToolRequest req) =>
    Ok(Convert.ToBase64String(Encoding.UTF8.GetBytes(req.Input))));

app.MapPost("/api/converters/base64-decode", (ToolRequest req) => {
    try { return Ok(Encoding.UTF8.GetString(Convert.FromBase64String(req.Input.Trim()))); }
    catch { return Err("Invalid Base64 string."); }
});
```

---

### 1.5 Number Base Converter (Hex ↔ Decimal ↔ Binary ↔ Octal)

Pure BCL. Input: a number string + its base. Output: all four representations.

```csharp
app.MapPost("/api/converters/number-base", (ToolRequest req) => {
    var fromBase = int.Parse(req.Options?["fromBase"] ?? "10");
    try {
        long value = Convert.ToInt64(req.Input.Trim(), fromBase);
        return Ok(JsonSerializer.Serialize(new {
            decimal_ = value.ToString(),
            hex      = value.ToString("X"),
            binary   = Convert.ToString(value, 2),
            octal    = Convert.ToString(value, 8),
        }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI:** Four labeled inputs (Dec, Hex, Bin, Oct). Any one edited → POST → fill the other three.

---

### 1.6 Color Code Converter (Hex, RGB, HSL, CMYK)

Pure math — no packages. Parse any format, return all four.

**Algorithm:**

1. Parse input format (detect by shape: `#rrggbb`, `rgb(...)`, `hsl(...)`, `cmyk(...)`).
2. Normalize to `(r, g, b)` integers 0–255 as the canonical intermediate.
3. Derive HSL from RGB: standard formula.
4. Derive CMYK from RGB: `k = 1 - max(r,g,b)/255`, then `c = (1-r/255 - k)/(1-k)`, etc.

```csharp
app.MapPost("/api/converters/color", (ToolRequest req) => {
    try {
        var (r, g, b) = ParseColor(req.Input.Trim()); // implement ParseColor
        var (h, s, l) = RgbToHsl(r, g, b);
        var (c, m, y, k) = RgbToCmyk(r, g, b);
        return Ok(JsonSerializer.Serialize(new {
            hex  = $"#{r:X2}{g:X2}{b:X2}",
            rgb  = $"rgb({r}, {g}, {b})",
            hsl  = $"hsl({h:F0}, {s:F1}%, {l:F1}%)",
            cmyk = $"cmyk({c:F0}%, {m:F0}%, {y:F0}%, {k:F0}%)",
        }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI:** Color preview swatch. All four format inputs displayed, each copyable.

---

## Section 2 — Encoders / Decoders

### 2.1 URL Encoder / Decoder

```csharp
app.MapPost("/api/encoders/url-encode",  (ToolRequest req) =>
    Ok(Uri.EscapeDataString(req.Input)));

app.MapPost("/api/encoders/url-decode",  (ToolRequest req) => {
    try { return Ok(Uri.UnescapeDataString(req.Input)); }
    catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 2.2 HTML Encoder / Decoder

```csharp
// Add: #:package System.Web.HttpUtility (included in .NET SDK, no extra package)
app.MapPost("/api/encoders/html-encode",  (ToolRequest req) =>
    Ok(System.Net.WebUtility.HtmlEncode(req.Input)));

app.MapPost("/api/encoders/html-decode",  (ToolRequest req) =>
    Ok(System.Net.WebUtility.HtmlDecode(req.Input)));
```

---

### 2.3 JWT Encoder / Decoder

**Package:** `Microsoft.IdentityModel.JsonWebTokens`

**Decode (no verification — inspection only):**
Split token by `.`, Base64Url-decode header and payload, pretty-print as JSON.
Mark signature as unverified in the UI.

```csharp
app.MapPost("/api/encoders/jwt-decode", (ToolRequest req) => {
    try {
        var parts = req.Input.Trim().Split('.');
        if (parts.Length != 3) return Err("Not a valid JWT (expected 3 parts).");
        string Decode(string s) {
            s = s.PadRight(s.Length + (4 - s.Length % 4) % 4, '=')
                 .Replace('-', '+').Replace('_', '/');
            return Encoding.UTF8.GetString(Convert.FromBase64String(s));
        }
        var header  = JsonSerializer.Serialize(JsonDocument.Parse(Decode(parts[0])).RootElement,
                          new JsonSerializerOptions { WriteIndented = true });
        var payload = JsonSerializer.Serialize(JsonDocument.Parse(Decode(parts[1])).RootElement,
                          new JsonSerializerOptions { WriteIndented = true });
        return Ok(JsonSerializer.Serialize(new { header, payload, signature = parts[2] }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 2.4 Morse Code Encoder / Decoder

No packages. Hardcode the Morse map as a `Dictionary<char, string>`.

```csharp
// Encode: split input to chars, look up each, join with " ". Words separated by " / ".
// Decode: split by " / " for words, split each word by " " for chars, reverse-lookup.
```

---

## Section 3 — Formatters

### 3.1 JSON Formatter / Minifier

```csharp
app.MapPost("/api/formatters/json-format", (ToolRequest req) => {
    try {
        var indent = int.Parse(req.Options?.GetValueOrDefault("indent") ?? "2");
        var doc = JsonDocument.Parse(req.Input);
        return Ok(JsonSerializer.Serialize(doc.RootElement,
            new JsonSerializerOptions { WriteIndented = true }));
        // For custom indent, use Utf8JsonWriter with JsonWriterOptions { Indented = true }
    } catch (Exception ex) { return Err(ex.Message); }
});

app.MapPost("/api/formatters/json-minify", (ToolRequest req) => {
    try {
        var doc = JsonDocument.Parse(req.Input);
        return Ok(JsonSerializer.Serialize(doc.RootElement));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 3.2 XML Formatter

```csharp
app.MapPost("/api/formatters/xml-format", (ToolRequest req) => {
    try {
        var doc = XDocument.Parse(req.Input);
        return Ok(doc.ToString()); // XDocument.ToString() pretty-prints by default
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 3.3 CSV Formatter

Normalize messy CSV: re-parse and re-emit with consistent quoting and delimiter.

```csharp
// Options: delimiter (comma/tab/pipe), quoteAll (bool)
// Use CsvHelper: CsvReader to parse, CsvWriter to emit
```

---

### 3.4 SQL Formatter

**Package:** `SqlFormatter` NuGet package (wraps a port of the JS sql-formatter).

```csharp
app.MapPost("/api/formatters/sql-format", (ToolRequest req) => {
    var dialect = req.Options?.GetValueOrDefault("dialect") ?? "sql";
    try {
        var formatted = SqlFormatter.SqlFormatter.Format(req.Input, new SqlFormatter.FormatConfig {
            Language = dialect, IndentStyle = SqlFormatter.IndentStyle.Standard
        });
        return Ok(formatted);
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 3.5 JSON Stringify / Parse

**Stringify:** Take raw JSON, output a JavaScript-string-literal (escaped, double-quoted).
**Parse:** Take a JS string literal, unescape it, output pretty JSON.

```csharp
app.MapPost("/api/formatters/json-stringify", (ToolRequest req) => {
    // Validate it's valid JSON first, then:
    // JsonSerializer.Serialize(req.Input) — this produces a JSON string, which IS a JS string literal
    try {
        JsonDocument.Parse(req.Input); // validate
        return Ok(JsonSerializer.Serialize(req.Input)); // wraps in quotes + escapes
    } catch (Exception ex) { return Err(ex.Message); }
});

app.MapPost("/api/formatters/json-parse", (ToolRequest req) => {
    try {
        // Input is a JSON string literal — deserialize to get the raw JSON, then format
        var raw = JsonSerializer.Deserialize<string>(req.Input)!;
        var doc = JsonDocument.Parse(raw);
        return Ok(JsonSerializer.Serialize(doc.RootElement,
            new JsonSerializerOptions { WriteIndented = true }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

### 3.6 Diff Checker

No packages. Implement a line-by-line diff using the Myers diff algorithm or a simple
LCS-based diff.

**Output format:** Return a JSON array of diff hunks:
```json
[
  { "type": "equal",   "line": "foo" },
  { "type": "removed", "line": "bar" },
  { "type": "added",   "line": "baz" }
]
```

**UI:** Two side-by-side textareas. Output rendered as a styled diff view (red for removed,
green for added). Supports plain text and JSON mode (JSON mode normalizes formatting before
diffing so whitespace changes are ignored).

---

## Section 4 — Validators

### 4.1 JSON Validator

```csharp
app.MapPost("/api/validators/json", (ToolRequest req) => {
    try {
        JsonDocument.Parse(req.Input);
        return Ok("Valid JSON.");
    } catch (JsonException ex) {
        return Err($"Invalid JSON at line {ex.LineNumber}, position {ex.BytePositionInLine}: {ex.Message}");
    }
});
```

---

### 4.2 XML Validator

```csharp
app.MapPost("/api/validators/xml", (ToolRequest req) => {
    try {
        XDocument.Parse(req.Input);
        return Ok("Valid XML.");
    } catch (XmlException ex) {
        return Err($"Invalid XML at line {ex.LineNumber}: {ex.Message}");
    }
});
```

---

### 4.3 Regex Validator / Tester

```csharp
app.MapPost("/api/validators/regex", (ToolRequest req) => {
    // Options: pattern, flags (i, m, s, g)
    var pattern = req.Options?["pattern"] ?? "";
    var flags   = req.Options?.GetValueOrDefault("flags") ?? "";
    var opts    = RegexOptions.None;
    if (flags.Contains('i')) opts |= RegexOptions.IgnoreCase;
    if (flags.Contains('m')) opts |= RegexOptions.Multiline;
    if (flags.Contains('s')) opts |= RegexOptions.Singleline;
    try {
        var rx = new Regex(pattern, opts);
        var matches = rx.Matches(req.Input).Select(m => new {
            value = m.Value,
            index = m.Index,
            length = m.Length,
            groups = m.Groups.Cast<Group>().Skip(1).Select(g => g.Value).ToList()
        }).ToList();
        return Ok(JsonSerializer.Serialize(new { count = matches.Count, matches }));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI:** Pattern input, flags checkboxes, test string textarea. Show each match highlighted
(use offsets from response to apply spans in the UI).

---

### 4.4 JSON Schema Validator

**Package:** Use `JsonSchema.Net` (NuGet: `JsonSchema.Net`).

```csharp
#:package JsonSchema.Net@7.*

app.MapPost("/api/validators/json-schema", (ToolRequest req) => {
    // req.Input = JSON document, req.Options["schema"] = schema JSON string
    try {
        var schema   = JsonSchema.Net.JsonSchema.FromText(req.Options!["schema"]);
        var instance = JsonDocument.Parse(req.Input).RootElement;
        var result   = schema.Evaluate(instance, new JsonSchema.Net.EvaluationOptions {
            OutputFormat = JsonSchema.Net.OutputFormat.List
        });
        if (result.IsValid)
            return Ok("Valid — document matches schema.");
        var errors = result.Details
            .Where(d => !d.IsValid && d.Errors != null)
            .SelectMany(d => d.Errors!.Select(e => $"{d.InstanceLocation}: {e.Value}"))
            .ToList();
        return Err(string.Join("\n", errors));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

**UI:** Two textareas — left for schema, right for document. Errors listed below.

---

### 4.5 IP Address Validator (IPv4 + IPv6)

```csharp
app.MapPost("/api/validators/ip", (ToolRequest req) => {
    var input = req.Input.Trim();
    if (System.Net.IPAddress.TryParse(input, out var ip)) {
        var type = ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork
                   ? "IPv4" : "IPv6";
        return Ok(JsonSerializer.Serialize(new {
            valid   = true,
            type,
            address = ip.ToString(),
            // For IPv4: compute class, private range, loopback, etc.
        }));
    }
    return Err($"'{input}' is not a valid IP address.");
});
```

---

### 4.6 Cron Expression Validator / Parser

**Package:** `Cronos` (NuGet: `Cronos`).

```csharp
#:package Cronos@0.8.*

app.MapPost("/api/validators/cron", (ToolRequest req) => {
    try {
        var cron = CronExpression.Parse(req.Input.Trim(), CronFormat.IncludeSeconds);
        // Get next 5 occurrences
        var now   = DateTime.UtcNow;
        var nexts = Enumerable.Range(0, 5)
            .Aggregate((list: new List<string>(), from: now), (acc, _) => {
                var next = cron.GetNextOccurrence(acc.from, TimeZoneInfo.Utc);
                if (next.HasValue) acc.list.Add(next.Value.ToString("yyyy-MM-dd HH:mm:ss UTC"));
                return (acc.list, next ?? acc.from);
            }).list;
        return Ok(JsonSerializer.Serialize(new { valid = true, nextOccurrences = nexts }));
    } catch (Exception ex) { return Err($"Invalid cron expression: {ex.Message}"); }
});
```

---

## Section 5 — Generators

### 5.1 Lorem Ipsum Generator

Pure logic — hardcode the standard Lorem Ipsum corpus. Generate by words/sentences/paragraphs.

```csharp
// Options: type (words/sentences/paragraphs), count
app.MapPost("/api/generators/lorem", (ToolRequest req) => {
    var type  = req.Options?.GetValueOrDefault("type") ?? "paragraphs";
    var count = int.Parse(req.Options?.GetValueOrDefault("count") ?? "3");
    return Ok(LoremGenerator.Generate(type, count)); // implement using corpus
});
```

---

### 5.2 Random Password Generator

```csharp
// Options: length, includeUpper, includeLower, includeNumbers, includeSymbols
app.MapPost("/api/generators/password", (ToolRequest req) => {
    var length  = int.Parse(req.Options?.GetValueOrDefault("length") ?? "16");
    var charset = BuildCharset(req.Options);
    if (charset.Length == 0) return Err("Select at least one character set.");
    var rng = RandomNumberGenerator.Create();
    var bytes = new byte[length];
    rng.GetBytes(bytes);
    return Ok(new string(bytes.Select(b => charset[b % charset.Length]).ToArray()));
});
// Use RandomNumberGenerator (cryptographically secure), NOT Random
```

---

### 5.3 UUID Generator

```csharp
// Options: type (v4/nil/v7), count
app.MapPost("/api/generators/uuid", (ToolRequest req) => {
    var type  = req.Options?.GetValueOrDefault("type") ?? "v4";
    var count = Math.Min(int.Parse(req.Options?.GetValueOrDefault("count") ?? "1"), 100);
    var ids = Enumerable.Range(0, count).Select(_ => type switch {
        "nil" => Guid.Empty.ToString(),
        "v7"  => Guid.CreateVersion7().ToString(), // .NET 9+
        _     => Guid.NewGuid().ToString()
    }).ToList();
    return Ok(string.Join("\n", ids));
});
```

---

### 5.4 QR Code Generator

**Package:** `QRCoder`

```csharp
app.MapPost("/api/generators/qr", (ToolRequest req) => {
    using var qr = new QRCodeGenerator();
    var data = qr.CreateQrCode(req.Input, QRCodeGenerator.ECCLevel.Q);
    using var code = new PngByteQRCode(data);
    var png = code.GetGraphic(10);
    return Ok($"data:image/png;base64,{Convert.ToBase64String(png)}");
});
```

**UI:** Render the base64 PNG in an `<img>` tag. Provide a download link.

---

### 5.5 Hash Generator

**Algorithms:** MD5, SHA-1, SHA-256, SHA-512 — all in BCL (`System.Security.Cryptography`).
**bcrypt:** Package `BCrypt.Net-Next`.

```csharp
app.MapPost("/api/generators/hash", (ToolRequest req) => {
    var algo = req.Options?.GetValueOrDefault("algo") ?? "sha256";
    var input = Encoding.UTF8.GetBytes(req.Input);
    var hash = algo switch {
        "md5"    => MD5.HashData(input),
        "sha1"   => SHA1.HashData(input),
        "sha256" => SHA256.HashData(input),
        "sha512" => SHA512.HashData(input),
        "bcrypt" => return Ok(BCrypt.Net.BCrypt.HashPassword(req.Input, workFactor: 12)),
        _        => return Err("Unknown algorithm.")
    };
    return Ok(Convert.ToHexString(hash).ToLower());
});
```

---

### 5.6 Fake Data Generator

**Package:** `Bogus`

```csharp
app.MapPost("/api/generators/fake-data", (ToolRequest req) => {
    var locale = req.Options?.GetValueOrDefault("locale") ?? "en";
    var count  = int.Parse(req.Options?.GetValueOrDefault("count") ?? "5");
    var faker  = new Bogus.Faker(locale);
    var data   = Enumerable.Range(0, count).Select(_ => new {
        name    = faker.Name.FullName(),
        email   = faker.Internet.Email(),
        phone   = faker.Phone.PhoneNumber(),
        address = faker.Address.FullAddress(),
        company = faker.Company.CompanyName(),
        dob     = faker.Person.DateOfBirth.ToString("yyyy-MM-dd"),
    }).ToList();
    return Ok(JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true }));
});
```

---

### 5.7 JWT Generator

**Package:** `Microsoft.IdentityModel.JsonWebTokens`

```csharp
// Options: algorithm (HS256/HS384/HS512), secret, expiry (minutes)
app.MapPost("/api/generators/jwt", (ToolRequest req) => {
    try {
        var payload = JsonDocument.Parse(req.Input).RootElement; // user provides claims as JSON
        var secret  = req.Options?["secret"] ?? "dev-secret-key";
        var expiry  = int.Parse(req.Options?.GetValueOrDefault("expiry") ?? "60");
        var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var handler = new JsonWebTokenHandler();
        var descriptor = new SecurityTokenDescriptor {
            Claims = payload.EnumerateObject().ToDictionary(p => p.Name, p => (object)p.Value.ToString()),
            Expires = DateTime.UtcNow.AddMinutes(expiry),
            SigningCredentials = creds
        };
        return Ok(handler.CreateToken(descriptor));
    } catch (Exception ex) { return Err(ex.Message); }
});
```

---

## Section 6 — Cryptography

### 6.1 AES Encrypt / Decrypt

Pure BCL (`System.Security.Cryptography`). Use AES-256-CBC with a random IV.

**Key derivation:** Never use the raw password as the AES key. Derive using PBKDF2:

```csharp
// Derive a 256-bit key from password + salt using PBKDF2-SHA256, 100_000 iterations
byte[] DeriveKey(string password, byte[] salt) =>
    Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
```

**Encrypt output format:** `base64(salt [16 bytes] + iv [16 bytes] + ciphertext)`
This way the salt and IV travel with the ciphertext and no extra fields are needed.

```csharp
app.MapPost("/api/crypto/aes-encrypt", (ToolRequest req) => {
    var password = req.Options?["password"];
    if (string.IsNullOrEmpty(password)) return Err("Password is required.");
    try {
        var salt = RandomNumberGenerator.GetBytes(16);
        var iv   = RandomNumberGenerator.GetBytes(16);
        var key  = DeriveKey(password, salt);
        using var aes = Aes.Create();
        aes.Key = key; aes.IV = iv; aes.Mode = CipherMode.CBC; aes.Padding = PaddingMode.PKCS7;
        using var enc = aes.CreateEncryptor();
        var plain = Encoding.UTF8.GetBytes(req.Input);
        var cipher = enc.TransformFinalBlock(plain, 0, plain.Length);
        var combined = salt.Concat(iv).Concat(cipher).ToArray();
        return Ok(Convert.ToBase64String(combined));
    } catch (Exception ex) { return Err(ex.Message); }
});

app.MapPost("/api/crypto/aes-decrypt", (ToolRequest req) => {
    var password = req.Options?["password"];
    if (string.IsNullOrEmpty(password)) return Err("Password is required.");
    try {
        var combined = Convert.FromBase64String(req.Input.Trim());
        var salt   = combined[..16];
        var iv     = combined[16..32];
        var cipher = combined[32..];
        var key    = DeriveKey(password, salt);
        using var aes = Aes.Create();
        aes.Key = key; aes.IV = iv; aes.Mode = CipherMode.CBC; aes.Padding = PaddingMode.PKCS7;
        using var dec = aes.CreateDecryptor();
        var plain = dec.TransformFinalBlock(cipher, 0, cipher.Length);
        return Ok(Encoding.UTF8.GetString(plain));
    } catch { return Err("Decryption failed. Wrong password or corrupted data."); }
});
```

**UI notes:** Password field (type=password, toggle visibility). Never display password in
output. Show a warning: "This tool runs on server — do not encrypt truly sensitive data."

---

## Section 7 — Text Utilities

### 7.1 Word / Character / Line Counter

```csharp
app.MapPost("/api/text/count", (ToolRequest req) => {
    var text = req.Input;
    return Ok(JsonSerializer.Serialize(new {
        characters         = text.Length,
        charactersNoSpaces = text.Count(c => !char.IsWhiteSpace(c)),
        words              = text.Split(new[] {' ','\t','\n','\r'}, StringSplitOptions.RemoveEmptyEntries).Length,
        lines              = text.Split('\n').Length,
        sentences          = Regex.Matches(text, @"[.!?]+").Count,
        paragraphs         = text.Split(new[]{"\n\n"}, StringSplitOptions.RemoveEmptyEntries).Length,
        readingTimeMinutes = Math.Round(text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length / 200.0, 1),
    }));
});
```

---

### 7.2 Case Converter

```csharp
app.MapPost("/api/text/case", (ToolRequest req) => {
    var to = req.Options?.GetValueOrDefault("to") ?? "camel";
    // 1. Tokenize: split by spaces, underscores, hyphens, and capital-letter boundaries
    var words = Tokenize(req.Input); // handle camelCase, PascalCase, kebab-case, snake_case input
    var result = to switch {
        "camel"  => words[0].ToLower() + string.Concat(words.Skip(1).Select(Capitalize)),
        "pascal" => string.Concat(words.Select(Capitalize)),
        "snake"  => string.Join("_", words.Select(w => w.ToLower())),
        "kebab"  => string.Join("-", words.Select(w => w.ToLower())),
        "upper"  => req.Input.ToUpper(),
        "lower"  => req.Input.ToLower(),
        "title"  => string.Join(" ", words.Select(Capitalize)),
        _        => req.Input
    };
    return Ok(result);
});

// Tokenize: Regex split on spaces/underscores/hyphens + insert boundary before uppercase runs
// "myVariableName" → ["my","Variable","Name"]
// "my-variable_name" → ["my","variable","name"]
```

---

### 7.3 String Escape / Unescape

```csharp
// Options: lang (js/json/sql)
app.MapPost("/api/text/escape", (ToolRequest req) => {
    var lang = req.Options?.GetValueOrDefault("lang") ?? "json";
    return lang switch {
        "json" => Ok(JsonSerializer.Serialize(req.Input)[1..^1]), // strip outer quotes
        "sql"  => Ok(req.Input.Replace("'", "''")),
        "js"   => Ok(req.Input.Replace("\\","\\\\").Replace("\"","\\\"").Replace("\n","\\n")
                              .Replace("\r","\\r").Replace("\t","\\t")),
        _      => Err("Unknown language.")
    };
});
```

---

### 7.4 Whitespace / Duplicate Line Remover

```csharp
// Options: trimLines, removeEmpty, removeDuplicates, normalizeSpaces
app.MapPost("/api/text/whitespace", (ToolRequest req) => {
    var opts = req.Options ?? new();
    var lines = req.Input.Split('\n');
    if (opts.GetValueOrDefault("trimLines") == "true")
        lines = lines.Select(l => l.Trim()).ToArray();
    if (opts.GetValueOrDefault("normalizeSpaces") == "true")
        lines = lines.Select(l => Regex.Replace(l, @"\s+", " ")).ToArray();
    if (opts.GetValueOrDefault("removeEmpty") == "true")
        lines = lines.Where(l => !string.IsNullOrWhiteSpace(l)).ToArray();
    if (opts.GetValueOrDefault("removeDuplicates") == "true")
        lines = lines.Distinct().ToArray();
    return Ok(string.Join("\n", lines));
});
```

---

### 7.5 Slugify

```csharp
app.MapPost("/api/text/slugify", (ToolRequest req) => {
    var slug = req.Input.ToLower().Trim();
    slug = Regex.Replace(slug, @"[^\w\s-]", "");   // remove special chars
    slug = Regex.Replace(slug, @"[\s_-]+", "-");   // collapse whitespace/underscores to hyphen
    slug = Regex.Replace(slug, @"^-+|-+$", "");    // trim leading/trailing hyphens
    return Ok(slug);
});
```

---

## Frontend Architecture

### API helper (in `app.jsx`)

```jsx
async function api(endpoint, input, options = {}) {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, options })
  });
  return res.json(); // always { output, error }
}
```

### Tool component pattern (every tool uses this shape)

```jsx
function JsonYaml() {
  const [input, setInput]   = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError]   = React.useState(null);
  const [dir, setDir]       = React.useState('json-to-yaml');

  async function run() {
    const { output, error } = await api(`converters/${dir}`, input);
    setOutput(output ?? '');
    setError(error ?? null);
  }

  return ( /* two textareas, a toggle, error display */ );
}
```

### Tab/nav structure (`app.jsx`)

```jsx
const TOOLS = {
  converters:   ['json-yaml', 'json-csv', 'timestamp', 'base64', 'number-base', 'color'],
  encoders:     ['url', 'html', 'jwt', 'morse'],
  formatters:   ['json', 'xml', 'csv', 'sql', 'json-stringify', 'diff'],
  validators:   ['json', 'xml', 'regex', 'json-schema', 'ip', 'cron'],
  generators:   ['lorem', 'password', 'uuid', 'qr', 'hash', 'fake-data', 'jwt'],
  cryptography: ['aes'],
  text:         ['counter', 'case', 'escape', 'whitespace', 'slugify'],
};
```

Use a two-level nav: category tabs across the top, tool list in a sidebar or as a sub-tab row.

---

## Port Allocation

If this is a standalone app in the repo:

```json
{ "applicationUrl": "http://localhost:5100" }
```

---

## Key Implementation Rules (Summary)

- All transformation, parsing, hashing, and cryptography logic lives in `App.cs` endpoints
- The UI posts input and options; it only displays `output` or `error` from the response
- Every endpoint catches all exceptions and returns `Err(ex.Message)` — never 500s
- Use `RandomNumberGenerator` (not `Random`) for passwords and AES IVs
- AES always derives the key via PBKDF2 — never uses the raw password string as the key
- JWT decode does not verify the signature — make this clear in the UI
- bcrypt is one-way — put it under Hash Generator, not under AES (which is reversible)
- QR code returns a base64 PNG data URL — the `<img src="...">` renders it directly