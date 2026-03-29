#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*

using Microsoft.EntityFrameworkCore;

// --- App ---
var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));

var app = builder.Build();

// Auto migrate + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Pages.Any())
    {
        var page = new Page { Title = "Welcome", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        db.Pages.Add(page);
        db.SaveChanges();

        db.Blocks.AddRange(
            new Block { PageId = page.Id, Type = "heading1",   Content = "Welcome to Block Notes",  Order = 0 },
            new Block { PageId = page.Id, Type = "paragraph",  Content = "This is a block-based note-taking app. Click + to add a new block.",  Order = 1 },
            new Block { PageId = page.Id, Type = "todo",       Content = "Try creating a new page",  Order = 2, Checked = false },
            new Block { PageId = page.Id, Type = "todo",       Content = "Add some blocks",          Order = 3, Checked = false },
            new Block { PageId = page.Id, Type = "quote",      Content = "The best tool is the one you actually use.",  Order = 4 }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

// --- Pages API ---
var pages = app.MapGroup("/api/pages");

pages.MapGet("/", async (AppDbContext db) =>
    await db.Pages.OrderBy(p => p.CreatedAt).ToListAsync());

pages.MapPost("/", async (AppDbContext db, CreatePageRequest req) =>
{
    var page = new Page
    {
        Title = string.IsNullOrWhiteSpace(req.Title) ? "Untitled" : req.Title.Trim(),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
    db.Pages.Add(page);
    await db.SaveChangesAsync();
    return Results.Created($"/api/pages/{page.Id}", page);
});

pages.MapPatch("/{id}", async (AppDbContext db, int id, UpdatePageRequest req) =>
{
    var page = await db.Pages.FindAsync(id);
    if (page is null) return Results.NotFound();
    page.Title = string.IsNullOrWhiteSpace(req.Title) ? "Untitled" : req.Title.Trim();
    page.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(page);
});

pages.MapDelete("/{id}", async (AppDbContext db, int id) =>
{
    var page = await db.Pages.Include(p => p.Blocks).FirstOrDefaultAsync(p => p.Id == id);
    if (page is null) return Results.NotFound();
    db.Pages.Remove(page);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

pages.MapGet("/{id}/blocks", async (AppDbContext db, int id) =>
    await db.Blocks.Where(b => b.PageId == id).OrderBy(b => b.Order).ToListAsync());

pages.MapPost("/{id}/blocks", async (AppDbContext db, int id, CreateBlockRequest req) =>
{
    var exists = await db.Pages.AnyAsync(p => p.Id == id);
    if (!exists) return Results.NotFound();

    int targetOrder;

    if (req.InsertAfterId.HasValue)
    {
        // Insert after a specific block: shift all subsequent blocks up
        var anchor = await db.Blocks.FindAsync(req.InsertAfterId.Value);
        if (anchor is null) return Results.NotFound();
        targetOrder = anchor.Order + 1;

        var toShift = await db.Blocks
            .Where(b => b.PageId == id && b.Order >= targetOrder)
            .ToListAsync();
        foreach (var b in toShift) b.Order++;
    }
    else
    {
        var maxOrder = await db.Blocks
            .Where(b => b.PageId == id)
            .Select(b => (int?)b.Order)
            .MaxAsync() ?? -1;
        targetOrder = req.Order.HasValue ? req.Order.Value : maxOrder + 1;
    }

    var block = new Block
    {
        PageId  = id,
        Type    = req.Type ?? "paragraph",
        Content = req.Content ?? "",
        Order   = targetOrder,
        Checked = false
    };
    db.Blocks.Add(block);
    await db.SaveChangesAsync();
    return Results.Created($"/api/blocks/{block.Id}", block);
});

// --- Blocks API ---
var blocks = app.MapGroup("/api/blocks");

blocks.MapPatch("/{id}", async (AppDbContext db, int id, UpdateBlockRequest req) =>
{
    var block = await db.Blocks.FindAsync(id);
    if (block is null) return Results.NotFound();
    if (req.Content is not null) block.Content = req.Content;
    if (req.Type    is not null) block.Type    = req.Type;
    if (req.Checked is not null) block.Checked = req.Checked.Value;
    await db.SaveChangesAsync();
    return Results.Ok(block);
});

blocks.MapDelete("/{id}", async (AppDbContext db, int id) =>
{
    var block = await db.Blocks.FindAsync(id);
    if (block is null) return Results.NotFound();
    db.Blocks.Remove(block);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Move a block up or down — swaps Order values with neighbor
blocks.MapPatch("/{id}/reorder", async (AppDbContext db, int id, ReorderRequest req) =>
{
    var block = await db.Blocks.FindAsync(id);
    if (block is null) return Results.NotFound();

    Block? neighbor;
    if (req.Direction == "up")
        neighbor = await db.Blocks
            .Where(b => b.PageId == block.PageId && b.Order < block.Order)
            .OrderByDescending(b => b.Order).FirstOrDefaultAsync();
    else
        neighbor = await db.Blocks
            .Where(b => b.PageId == block.PageId && b.Order > block.Order)
            .OrderBy(b => b.Order).FirstOrDefaultAsync();

    if (neighbor is null) return Results.BadRequest("Cannot move in that direction.");

    (block.Order, neighbor.Order) = (neighbor.Order, block.Order);
    await db.SaveChangesAsync();
    return Results.Ok(new { block, neighbor });
});

app.Run();


// --- Models (always after app.Run()) ---

class Page
{
    public int      Id        { get; set; }
    public string   Title     { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Block> Blocks { get; set; } = [];
}

class Block
{
    public int    Id      { get; set; }
    public int    PageId  { get; set; }
    public string Type    { get; set; } = "paragraph";
    public string Content { get; set; } = "";
    public int    Order   { get; set; }
    public bool   Checked { get; set; } = false;
}

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Page>  Pages  => Set<Page>();
    public DbSet<Block> Blocks => Set<Block>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Page>()
            .HasMany(p => p.Blocks)
            .WithOne()
            .HasForeignKey(b => b.PageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

// --- Request DTOs ---
record CreatePageRequest(string? Title);
record UpdatePageRequest(string? Title);
record CreateBlockRequest(string? Type, string? Content, int? Order, int? InsertAfterId);
record UpdateBlockRequest(string? Type, string? Content, bool? Checked);
record ReorderRequest(string Direction);
