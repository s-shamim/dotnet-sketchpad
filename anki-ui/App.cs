#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*
#:package Microsoft.EntityFrameworkCore.Design@10.*

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=anki-ui.db"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// ── Preferences ───────────────────────────────────────────
app.MapGet("/api/preferences", async (AppDbContext db) =>
{
    var prefs = await db.Preferences.ToListAsync();
    return Results.Ok(prefs.ToDictionary(p => p.Key, p => p.Value));
});

app.MapPost("/api/preferences", async (AppDbContext db, PreferenceDto dto) =>
{
    var existing = await db.Preferences.FirstOrDefaultAsync(p => p.Key == dto.Key);
    if (existing is null)
        db.Preferences.Add(new Preference { Key = dto.Key, Value = dto.Value });
    else
        existing.Value = dto.Value;
    await db.SaveChangesAsync();
    return Results.Ok();
});

// ── Saved Searches ────────────────────────────────────────
app.MapGet("/api/searches", async (AppDbContext db) =>
    await db.SavedSearches.OrderBy(s => s.Name).ToListAsync());

app.MapPost("/api/searches", async (AppDbContext db, SavedSearch search) =>
{
    search.CreatedAt = DateTime.UtcNow;
    db.SavedSearches.Add(search);
    await db.SaveChangesAsync();
    return Results.Created($"/api/searches/{search.Id}", search);
});

app.MapDelete("/api/searches/{id}", async (AppDbContext db, int id) =>
{
    var search = await db.SavedSearches.FindAsync(id);
    if (search is null) return Results.NotFound();
    db.SavedSearches.Remove(search);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ── Undo Log ──────────────────────────────────────────────
app.MapGet("/api/undo", async (AppDbContext db) =>
    await db.UndoLog.OrderByDescending(u => u.CreatedAt).Take(30).ToListAsync());

app.MapPost("/api/undo", async (AppDbContext db, UndoEntry entry) =>
{
    entry.CreatedAt = DateTime.UtcNow;
    db.UndoLog.Add(entry);
    await db.SaveChangesAsync();
    return Results.Created($"/api/undo/{entry.Id}", entry);
});

app.MapDelete("/api/undo/{id}", async (AppDbContext db, int id) =>
{
    var entry = await db.UndoLog.FindAsync(id);
    if (entry is null) return Results.NotFound();
    db.UndoLog.Remove(entry);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ── Bulk Import History ───────────────────────────────────
app.MapGet("/api/imports", async (AppDbContext db) =>
    await db.ImportRecords.OrderByDescending(r => r.ImportedAt).ToListAsync());

app.MapPost("/api/imports", async (AppDbContext db, ImportRecord record) =>
{
    record.ImportedAt = DateTime.UtcNow;
    db.ImportRecords.Add(record);
    await db.SaveChangesAsync();
    return Results.Created($"/api/imports/{record.Id}", record);
});

// ── Quick-Add Session Log ─────────────────────────────────
app.MapGet("/api/quicklog", async (AppDbContext db) =>
{
    var today = DateTime.UtcNow.Date;
    return await db.QuickLog
        .Where(q => q.AddedAt >= today)
        .OrderByDescending(q => q.AddedAt)
        .ToListAsync();
});

app.MapPost("/api/quicklog", async (AppDbContext db, QuickLogEntry entry) =>
{
    entry.AddedAt = DateTime.UtcNow;
    db.QuickLog.Add(entry);
    await db.SaveChangesAsync();
    return Results.Created($"/api/quicklog/{entry.Id}", entry);
});

app.Run();

// ── Types ─────────────────────────────────────────────────

record PreferenceDto(string Key, string Value);

class Preference
{
    public int Id { get; set; }
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
}

class SavedSearch
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Query { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

class UndoEntry
{
    public int Id { get; set; }
    // "addNote" | "deleteNote" | "updateNote" | "createDeck" | "deleteDeck"
    public string Action { get; set; } = "";
    public string Payload { get; set; } = ""; // JSON snapshot
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

class ImportRecord
{
    public int Id { get; set; }
    public string Deck { get; set; } = "";
    public int Total { get; set; }
    public int Succeeded { get; set; }
    public int Failed { get; set; }
    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;
}

class QuickLogEntry
{
    public int Id { get; set; }
    public string Deck { get; set; } = "";
    public string Front { get; set; } = "";
    public string Back { get; set; } = "";
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Preference>    Preferences   => Set<Preference>();
    public DbSet<SavedSearch>   SavedSearches => Set<SavedSearch>();
    public DbSet<UndoEntry>     UndoLog       => Set<UndoEntry>();
    public DbSet<ImportRecord>  ImportRecords => Set<ImportRecord>();
    public DbSet<QuickLogEntry> QuickLog      => Set<QuickLogEntry>();
}
