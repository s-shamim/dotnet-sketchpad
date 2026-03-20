#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.EntityFrameworkCore.Sqlite@9.*

using Microsoft.EntityFrameworkCore;


// --- App ---
var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=todos.db"));

var app = builder.Build();

// Auto migrate + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Todos.Any())
    {
        db.Todos.AddRange(
            new TodoItem { Title = "Try .NET 10 file-based apps" },
            new TodoItem { Title = "Build something with SQLite + EF Core" },
            new TodoItem { Title = "Keep it simple", Done = true }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

// --- API ---
var api = app.MapGroup("/api/todos");

api.MapGet("/", async (AppDbContext db) =>
    await db.Todos.OrderBy(t => t.CreatedAt).ToListAsync());

api.MapPost("/", async (AppDbContext db, TodoItem todo) =>
{
    todo.CreatedAt = DateTime.UtcNow;
    db.Todos.Add(todo);
    await db.SaveChangesAsync();
    return Results.Created($"/api/todos/{todo.Id}", todo);
});

api.MapPatch("/{id}/toggle", async (AppDbContext db, int id) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();
    todo.Done = !todo.Done;
    await db.SaveChangesAsync();
    return Results.Ok(todo);
});

api.MapDelete("/{id}", async (AppDbContext db, int id) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();
    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();


// --- DbContext ---
class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos => Set<TodoItem>();
}

// --- Model ---
class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public bool Done { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}