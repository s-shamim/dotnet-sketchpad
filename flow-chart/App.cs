#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*

using Microsoft.EntityFrameworkCore;

// --- Bootstrap ---
var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=app.db"));

var app = builder.Build();

// Auto-migrate + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Diagrams.Any())
    {
        var content = """
        {
          "nodes": [
            { "id": "n1", "type": "rect",    "x": 200, "y": 80,  "w": 160, "h": 60, "label": "start",    "style": { "fontSize": 14, "fontWeight": "normal", "fontFamily": "Inter, sans-serif", "textColor": "#374151", "fill": "#f9fafb", "stroke": "#d1d5db" } },
            { "id": "n2", "type": "diamond", "x": 200, "y": 220, "w": 160, "h": 80, "label": "decision?", "style": { "fontSize": 14, "fontWeight": "normal", "fontFamily": "Inter, sans-serif", "textColor": "#374151", "fill": "#f9fafb", "stroke": "#d1d5db" } },
            { "id": "n3", "type": "rect",    "x": 60,  "y": 380, "w": 160, "h": 60, "label": "path a",   "style": { "fontSize": 14, "fontWeight": "normal", "fontFamily": "Inter, sans-serif", "textColor": "#374151", "fill": "#f9fafb", "stroke": "#d1d5db" } },
            { "id": "n4", "type": "rect",    "x": 340, "y": 380, "w": 160, "h": 60, "label": "path b",   "style": { "fontSize": 14, "fontWeight": "normal", "fontFamily": "Inter, sans-serif", "textColor": "#374151", "fill": "#f9fafb", "stroke": "#d1d5db" } },
            { "id": "n5", "type": "rect",    "x": 200, "y": 520, "w": 160, "h": 60, "label": "end",      "style": { "fontSize": 14, "fontWeight": "normal", "fontFamily": "Inter, sans-serif", "textColor": "#374151", "fill": "#f9fafb", "stroke": "#d1d5db" } }
          ],
          "edges": [
            { "id": "e1", "fromId": "n1", "fromPort": "bottom", "toId": "n2", "toPort": "top",    "label": "" },
            { "id": "e2", "fromId": "n2", "fromPort": "left",   "toId": "n3", "toPort": "top",    "label": "yes" },
            { "id": "e3", "fromId": "n2", "fromPort": "right",  "toId": "n4", "toPort": "top",    "label": "no" },
            { "id": "e4", "fromId": "n3", "fromPort": "bottom", "toId": "n5", "toPort": "left",   "label": "" },
            { "id": "e5", "fromId": "n4", "fromPort": "bottom", "toId": "n5", "toPort": "right",  "label": "" }
          ],
          "groups": []
        }
        """;

        db.Diagrams.Add(new Diagram
        {
            Name = "sample flowchart",
            ContentJson = content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

// --- Diagrams API ---
var diagrams = app.MapGroup("/api/diagrams");

// List (no ContentJson to keep payloads small)
diagrams.MapGet("/", async (AppDbContext db) =>
    await db.Diagrams
        .OrderByDescending(d => d.UpdatedAt)
        .Select(d => new { d.Id, d.Name, d.CreatedAt, d.UpdatedAt })
        .ToListAsync());

// Create
diagrams.MapPost("/", async (AppDbContext db, CreateDiagramRequest req) =>
{
    var d = new Diagram
    {
        Name = string.IsNullOrWhiteSpace(req.Name) ? "untitled" : req.Name.Trim(),
        ContentJson = """{"nodes":[],"edges":[],"groups":[]}""",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
    db.Diagrams.Add(d);
    await db.SaveChangesAsync();
    return Results.Created($"/api/diagrams/{d.Id}", d);
});

// Get single (includes ContentJson)
diagrams.MapGet("/{id:int}", async (AppDbContext db, int id) =>
{
    var d = await db.Diagrams.FindAsync(id);
    return d is null ? Results.NotFound() : Results.Ok(d);
});

// Update (name + content)
diagrams.MapPut("/{id:int}", async (AppDbContext db, int id, UpdateDiagramRequest req) =>
{
    var d = await db.Diagrams.FindAsync(id);
    if (d is null) return Results.NotFound();
    if (req.Name is not null)
        d.Name = string.IsNullOrWhiteSpace(req.Name) ? "untitled" : req.Name.Trim();
    if (req.ContentJson is not null)
        d.ContentJson = req.ContentJson;
    d.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(d);
});

// Delete
diagrams.MapDelete("/{id:int}", async (AppDbContext db, int id) =>
{
    var d = await db.Diagrams.FindAsync(id);
    if (d is null) return Results.NotFound();
    db.Diagrams.Remove(d);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// --- Types (AFTER app.Run()) ---

class Diagram
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string ContentJson { get; set; } = """{"nodes":[],"edges":[],"groups":[]}""";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

record CreateDiagramRequest(string Name);
record UpdateDiagramRequest(string? Name, string? ContentJson);

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Diagram> Diagrams => Set<Diagram>();
}
