#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

using System.Text.Json;
using System.Text.Json.Nodes;

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/convert", (ConvertRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Json))
        return Results.BadRequest(new { error = "json input is required" });

    try
    {
        var node     = JsonNode.Parse(req.Json);
        var inferred = InferSchema(node);

        // Prepend $schema as first key
        var result = new JsonObject { ["$schema"] = "https://json-schema.org/draft/2020-12/schema" };
        foreach (var (k, v) in inferred)
            result[k] = v?.DeepClone();

        var opts = new JsonSerializerOptions { WriteIndented = true };
        return Results.Ok(new { schema = result.ToJsonString(opts) });
    }
    catch (JsonException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

// ----- Schema Inference -----

static JsonObject InferSchema(JsonNode? node) => node switch
{
    null         => new JsonObject { ["type"] = "null" },
    JsonObject o => InferObject(o),
    JsonArray  a => InferArray(a),
    JsonValue  v => InferValue(v),
    _            => new JsonObject()
};

static JsonObject InferObject(JsonObject obj)
{
    var schema = new JsonObject { ["type"] = "object" };
    if (obj.Count == 0) return schema;

    var props    = new JsonObject();
    var required = new JsonArray();

    foreach (var (key, val) in obj)
    {
        props[key] = InferSchema(val);
        required.Add(key);
    }

    schema["properties"] = props;
    schema["required"]   = required;
    return schema;
}

static JsonObject InferArray(JsonArray arr)
{
    var schema = new JsonObject { ["type"] = "array" };
    if (arr.Count == 0) return schema;

    var schemas = arr.Select(item => InferSchema(item)).ToList();
    schema["items"] = schemas.Count == 1 ? schemas[0] : MergeSchemas(schemas);
    return schema;
}

static JsonObject InferValue(JsonValue val) => val.GetValueKind() switch
{
    JsonValueKind.String                      => new JsonObject { ["type"] = "string" },
    JsonValueKind.True or JsonValueKind.False => new JsonObject { ["type"] = "boolean" },
    JsonValueKind.Null                        => new JsonObject { ["type"] = "null" },
    JsonValueKind.Number when IsInt(val)      => new JsonObject { ["type"] = "integer" },
    JsonValueKind.Number                      => new JsonObject { ["type"] = "number" },
    _                                         => new JsonObject()
};

static bool IsInt(JsonValue v)
{
    if (v.TryGetValue<long>(out _)) return true;
    return v.TryGetValue<double>(out var d) && d == Math.Truncate(d) && !double.IsInfinity(d);
}

static JsonObject MergeSchemas(List<JsonObject> schemas)
{
    var types = schemas
        .Select(s => (s["type"] as JsonValue)?.GetValue<string>())
        .Where(t => t is not null)
        .Distinct()
        .Order()
        .ToList();

    if (types.Count == 0) return new JsonObject();

    if (types.Count == 1) return types[0] switch
    {
        "object" => MergeObjects(schemas),
        "array"  => MergeArrayItems(schemas),
        var t    => new JsonObject { ["type"] = t }
    };

    // Mixed types — emit an array of types
    var typeArr = new JsonArray();
    foreach (var t in types) typeArr.Add(t);
    return new JsonObject { ["type"] = typeArr };
}

static JsonObject MergeObjects(List<JsonObject> schemas)
{
    var merged = new JsonObject { ["type"] = "object" };

    var allKeys = schemas
        .SelectMany(s => (s["properties"] as JsonObject)?.Select(p => p.Key) ?? [])
        .Distinct()
        .ToList();

    if (allKeys.Count == 0) return merged;

    var requiredSets = schemas
        .Select(s => s["required"] as JsonArray)
        .Where(r => r is not null)
        .Select(r => r!.Select(x => x!.GetValue<string>()).ToHashSet())
        .ToList();

    var properties     = new JsonObject();
    var commonRequired = new JsonArray();

    foreach (var key in allKeys)
    {
        var keySchemas = schemas
            .Select(s => (s["properties"] as JsonObject)?[key] as JsonObject)
            .Where(s => s is not null)
            .Cast<JsonObject>()
            .ToList();

        properties[key] = keySchemas.Count == 1
            ? keySchemas[0].DeepClone()
            : MergeSchemas(keySchemas);

        if (requiredSets.Count > 0 && requiredSets.All(rs => rs.Contains(key)))
            commonRequired.Add(key);
    }

    merged["properties"] = properties;
    if (commonRequired.Count > 0) merged["required"] = commonRequired;
    return merged;
}

static JsonObject MergeArrayItems(List<JsonObject> schemas)
{
    var merged = new JsonObject { ["type"] = "array" };

    var itemSchemas = schemas
        .Select(s => s["items"] as JsonObject)
        .Where(i => i is not null)
        .Cast<JsonObject>()
        .ToList();

    if (itemSchemas.Count > 0)
        merged["items"] = itemSchemas.Count == 1
            ? itemSchemas[0].DeepClone()
            : MergeSchemas(itemSchemas);

    return merged;
}

record ConvertRequest(string Json);
