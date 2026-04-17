---
name: sqlite-efcore
description: "EF Core + SQLite patterns for file-based C# apps. Use when adding database support to an app."
---

# SQLite with EF Core — File-Based App Patterns

> Use EF Core + SQLite for any data persistence need in a folder-based app.
> Always auto-migrate and seed at startup — no manual migration commands needed.
> For general C# file-based app conventions, see `backend.instructions.md`.

---

## Packages

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*
#:package Microsoft.EntityFrameworkCore.Design@10.*
```

---

## Full Starter Pattern

> ⚠️ **File structure rule**: In file-based apps, top-level statements (`var`, `app.Run()` etc.)
> must come **before** any type or class declarations. Always put models and DbContext
> at the **bottom** of the file, after `app.Run()`.

```csharp
#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*

using Microsoft.EntityFrameworkCore;

// --- Bootstrap (top-level statements FIRST) ---
var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));

var app = builder.Build();

// Auto migrate + seed on every startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();           // creates schema if it doesn't exist

    if (!db.Items.Any())                   // seed only when empty
    {
        db.Items.AddRange(
            new Item { Name = "Seed item 1" },
            new Item { Name = "Seed item 2" }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

// --- API endpoints ---
app.MapGet("/api/items", async (AppDbContext db) =>
    await db.Items.ToListAsync());

app.MapPost("/api/items", async (AppDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/items/{item.Id}", item);
});

app.MapDelete("/api/items/{id}", async (AppDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// --- Types AFTER app.Run() ---

class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();
}
```

---

## Rules

- The `.db` file lives next to `App.cs` — ❌ never use an absolute path
- Use `EnsureCreated()` for simple apps (no migration history needed)
- Seed only when the table is empty (`if (!db.Items.Any())`)
- Connection string goes in `appsettings.json` for folder apps, inline for simple scripts
- Models and `DbContext` go **after** `app.Run()` in the same file

---

## Connection String in appsettings.json

For apps that use `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  }
}
```

```csharp
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

---

## Multiple Entity Pattern

When an app needs several related entities:

```csharp
class Page
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<Block> Blocks { get; set; } = [];
}

class Block
{
    public int Id { get; set; }
    public int PageId { get; set; }
    public string Type { get; set; } = "paragraph";
    public string Content { get; set; } = "";
    public int Order { get; set; }
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<Block> Blocks => Set<Block>();
}
```

Seed with relationships:

```csharp
if (!db.Pages.Any())
{
    var page = new Page { Title = "Welcome", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
    db.Pages.Add(page);
    db.SaveChanges();

    db.Blocks.AddRange(
        new Block { PageId = page.Id, Type = "heading1", Content = "Welcome", Order = 0 },
        new Block { PageId = page.Id, Type = "paragraph", Content = "First paragraph.", Order = 1 }
    );
    db.SaveChanges();
}
```

---

## API Patterns with EF Core

### CRUD endpoint group

```csharp
var items = app.MapGroup("/api/items");

items.MapGet("/", async (AppDbContext db) =>
    await db.Items.OrderBy(i => i.Name).ToListAsync());

items.MapGet("/{id}", async (AppDbContext db, int id) =>
    await db.Items.FindAsync(id) is Item item ? Results.Ok(item) : Results.NotFound());

items.MapPost("/", async (AppDbContext db, CreateItemRequest req) =>
{
    var item = new Item { Name = req.Name.Trim() };
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/items/{item.Id}", item);
});

items.MapPatch("/{id}", async (AppDbContext db, int id, UpdateItemRequest req) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    item.Name = req.Name.Trim();
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

items.MapDelete("/{id}", async (AppDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
```

### Request DTOs (after `app.Run()`)

```csharp
record CreateItemRequest(string Name);
record UpdateItemRequest(string Name);
```
