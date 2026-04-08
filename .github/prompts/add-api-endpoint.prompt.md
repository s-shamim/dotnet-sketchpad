---
agent: "agent"
description: "Add an API endpoint to an existing App.cs"
---

# Add API Endpoint

Add a new API endpoint to an existing folder-based app's `App.cs`.

## Steps

1. **Identify the target app** — ask the user which folder app to modify.

2. **Read the existing `App.cs`** to understand:
   - Current route structure and grouping (`MapGroup` vs flat `MapGet`/`MapPost`)
   - Existing models and DbContext (at the bottom of the file, after `app.Run()`)
   - Whether the app uses EF Core + SQLite

3. **Ask** the user for:
   - What the endpoint does (CRUD, custom logic, etc.)
   - HTTP method and route
   - Whether it needs new model types

4. **Add the endpoint** following these rules:
   - Place endpoint registrations **before** `app.Run()` — with existing endpoints, not isolated
   - If the app uses `MapGroup`, add to the appropriate group
   - Use async/await for database operations
   - Return appropriate `Results.*` responses (`Results.Ok`, `Results.Created`, `Results.NotFound`, `Results.NoContent`)
   - Use request DTOs for POST/PUT/PATCH bodies

5. **Add any new types** (models, DTOs, records) **after** `app.Run()`:
   - ❌ Never place class/record declarations before top-level statements
   - If adding a new entity, add a `DbSet` to the existing `AppDbContext`
   - Use the `sqlite-efcore` skill for EF Core patterns if needed

6. **Verify** the app compiles by running `dotnet run <path-to-App.cs>`.
