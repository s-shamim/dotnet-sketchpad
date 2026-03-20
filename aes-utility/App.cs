#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/encrypt", (EncryptRequest req) =>
{
    try
    {
        var result = AesCrypto.Encrypt(req.Text, req.Key, req.Iv);
        return Results.Ok(new { result });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/decrypt", (DecryptRequest req) =>
{
    try
    {
        var result = AesCrypto.Decrypt(req.CipherText, req.Key, req.Iv);
        return Results.Ok(new { result });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

// --- Types ---

record EncryptRequest(string Text, string Key, string Iv);
record DecryptRequest(string CipherText, string Key, string Iv);

static class AesCrypto
{
    public static string Encrypt(string plainText, string key, string iv)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var ivBytes = Encoding.UTF8.GetBytes(iv);

        using var aes = Aes.Create();
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = keyBytes;
        aes.IV = ivBytes;

        var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

        using var ms = new MemoryStream();
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(plainText);
        }

        return Convert.ToBase64String(ms.ToArray());
    }

    public static string Decrypt(string cipherText, string key, string iv)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var ivBytes = Encoding.UTF8.GetBytes(iv);
        var cipherBytes = Convert.FromBase64String(cipherText);

        using var aes = Aes.Create();
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = keyBytes;
        aes.IV = ivBytes;

        var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

        try
        {
            using var ms = new MemoryStream(cipherBytes);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);
            return sr.ReadToEnd();
        }
        catch
        {
            return "keyError";
        }
    }
}
