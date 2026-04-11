#:property PublishAot=false
#:package Spectre.Console@0.54.0

using System.Text;
using Spectre.Console;

// ── Catalog ──────────────────────────────────────────────────────────────────

var catalog = new List<Product>
{
    // Women's
    new(1,  "Floral Maxi Dress",  "Women's",     79m,  "Lightweight floral print, perfect for summer",         ["XS","S","M","L","XL"]),
    new(2,  "Slim Fit Jeans",     "Women's",     59m,  "High-waist stretch denim in midnight blue",            ["XS","S","M","L","XL"]),
    new(3,  "Cashmere Sweater",   "Women's",    120m,  "Ultra-soft 100% cashmere in ivory",                    ["XS","S","M","L","XL"]),
    new(4,  "Trench Coat",        "Women's",    189m,  "Classic beige, double-breasted with belt",             ["XS","S","M","L","XL"]),
    // Men's
    new(5,  "Oxford Shirt",       "Men's",       55m,  "Crisp button-down in white poplin",                    ["S","M","L","XL","XXL"]),
    new(6,  "Chino Pants",        "Men's",       65m,  "Slim-tapered khaki chino",                             ["S","M","L","XL","XXL"]),
    new(7,  "Wool Blazer",        "Men's",      210m,  "Tailored herringbone wool blazer in charcoal",         ["S","M","L","XL","XXL"]),
    new(8,  "Leather Belt",       "Men's",       45m,  "Genuine full-grain leather in cognac",                 ["S","M","L","XL"]),
    // Accessories
    new(9,  "Leather Tote Bag",   "Accessories",135m,  "Pebbled leather, 3 internal compartments",            ["One Size"]),
    new(10, "Silk Scarf",         "Accessories", 48m,  "90×90cm satin silk, vintage floral motif",            ["One Size"]),
    new(11, "Stainless Watch",    "Accessories",289m,  "36mm case, mesh bracelet, sapphire crystal",          ["One Size"]),
    new(12, "Sunglasses",         "Accessories", 72m,  "UV400 polarised, acetate frame in tortoise",          ["One Size"]),
    // Sale
    new(13, "Puffer Jacket",      "Sale",       180m,  "Down-filled, water-resistant, detachable hood",       ["XS","S","M","L","XL"], IsOnSale: true, DiscountPercent: 40),
    new(14, "Ankle Boots",        "Sale",       130m,  "Block heel, side zip, genuine suede in stone",        ["36","37","38","39","40","41"], IsOnSale: true, DiscountPercent: 30),
    new(15, "Denim Jacket",       "Sale",        95m,  "Washed indigo, contrast stitching, chest pockets",    ["XS","S","M","L","XL"], IsOnSale: true, DiscountPercent: 25),
};

var categories = new[] { "Women's", "Men's", "Accessories", "Sale" };
var cart       = new List<CartItem>();

// ── Helpers ───────────────────────────────────────────────────────────────────

static void PressAnyKey() =>
    AnsiConsole.Prompt(new TextPrompt<string>("[dim]Press [[Enter]] to continue...[/]").AllowEmpty());

// ── Welcome ───────────────────────────────────────────────────────────────────

void ShowWelcome()
{
    AnsiConsole.Clear();
    AnsiConsole.WriteLine();
    AnsiConsole.Write(new FigletText("BOUTIQUE").Color(Color.HotPink));
    AnsiConsole.Write(new Rule("[dim]Premium Fashion · Curated Collections · Free Shipping[/]")
        .RuleStyle("grey"));
    AnsiConsole.MarkupLine(
        "\n  [bold gold1]Welcome![/]  Browse our latest collections and exclusive sale deals.\n" +
        "  [dim]Tip: use promo code [bold]SAVE10[/] at checkout for 10% off![/]\n");
}

// ── Product Table ─────────────────────────────────────────────────────────────

void ShowProductTable(IEnumerable<Product> products)
{
    var table = new Table()
        .Border(TableBorder.Rounded)
        .BorderColor(Color.Grey)
        .AddColumn(new TableColumn("[grey]#[/]").RightAligned())
        .AddColumn("[bold]Name[/]")
        .AddColumn("[bold]Sizes[/]")
        .AddColumn("[bold]Price[/]")
        .AddColumn("[dim]Description[/]");

    int i = 1;
    foreach (var p in products)
    {
        string saleBadge = p.IsOnSale ? " [bold on red] SALE [/]" : "";
        table.AddRow(
            $"[grey]{i++}[/]",
            p.Name + saleBadge,
            string.Join(", ", p.Sizes),
            p.DisplayPrice,
            $"[dim]{p.Description}[/]");
    }

    AnsiConsole.Write(table);
}

// ── Cart Display ──────────────────────────────────────────────────────────────

void ShowCartTable()
{
    if (cart.Count == 0)
    {
        AnsiConsole.Write(new Panel("[grey]  Your cart is empty.[/]\n\n  [dim]Browse the store to add items![/]")
            .Header("[bold gold1] Shopping Cart [/]")
            .BorderColor(Color.Gold1)
            .Padding(1, 0));
        return;
    }

    var table = new Table()
        .Border(TableBorder.Rounded)
        .BorderColor(Color.Gold1)
        .AddColumn("[bold]Item[/]")
        .AddColumn("[bold]Size[/]")
        .AddColumn(new TableColumn("[bold]Qty[/]").Centered())
        .AddColumn(new TableColumn("[bold]Unit[/]").RightAligned())
        .AddColumn(new TableColumn("[bold]Subtotal[/]").RightAligned());

    foreach (var item in cart)
    {
        table.AddRow(
            item.Product.Name,
            item.Size,
            item.Qty.ToString(),
            $"${item.Product.SalePrice:F2}",
            $"[bold]${item.Subtotal:F2}[/]");
    }

    table.AddEmptyRow();
    decimal total = cart.Sum(c => c.Subtotal);
    table.AddRow("[dim]Free Shipping[/]", "", "", "", "[bold green]$0.00[/]");
    table.AddRow("", "", "", "[bold gold1]TOTAL[/]", $"[bold gold1]${total:F2}[/]");

    AnsiConsole.Write(new Panel(table)
        .Header("[bold gold1] Shopping Cart [/]")
        .BorderColor(Color.Gold1));
}

// ── Browse Flow ───────────────────────────────────────────────────────────────

void BrowseFlow()
{
    while (true)
    {
        AnsiConsole.Clear();
        AnsiConsole.Write(new Rule("[bold gold1] Browse Store [/]").RuleStyle("gold1"));
        AnsiConsole.WriteLine();

        var categoryChoices = categories.ToList();
        categoryChoices.Add("← Back to Main Menu");

        var chosen = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("  Select a [bold gold1]category[/]:")
                .AddChoices(categoryChoices));

        if (chosen == "← Back to Main Menu") return;

        // ── Product selection loop for this category ──
        while (true)
        {
            AnsiConsole.Clear();
            AnsiConsole.Write(new Rule($"[bold gold1] {chosen} [/]").RuleStyle("gold1"));
            AnsiConsole.WriteLine();

            var products = catalog.Where(p => p.Category == chosen).ToList();
            ShowProductTable(products);
            AnsiConsole.WriteLine();

            var productChoices = products.Select(p => p.Name).ToList();
            productChoices.Add("← Back to Categories");

            var productName = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("  Select a [bold]product[/] to add to cart:")
                    .AddChoices(productChoices));

            if (productName == "← Back to Categories") break;

            var product = products.First(p => p.Name == productName);

            // Size
            string size;
            if (product.Sizes.Length == 1)
            {
                size = product.Sizes[0];
            }
            else
            {
                size = AnsiConsole.Prompt(
                    new SelectionPrompt<string>()
                        .Title("  Select [bold]size[/]:")
                        .AddChoices(product.Sizes));
            }

            // Quantity
            int qty = AnsiConsole.Prompt(
                new TextPrompt<int>("  [bold]Quantity:[/]")
                    .DefaultValue(1)
                    .Validate(q => q is >= 1 and <= 99
                        ? ValidationResult.Success()
                        : ValidationResult.Error("[red]Enter a number between 1 and 99[/]")));

            // Merge if already in cart
            var existing = cart.FirstOrDefault(c => c.Product.Id == product.Id && c.Size == size);
            if (existing is not null)
            {
                cart.Remove(existing);
                cart.Add(existing with { Qty = existing.Qty + qty });
            }
            else
            {
                cart.Add(new CartItem(product, size, qty));
            }

            int totalItems = cart.Sum(c => c.Qty);
            decimal totalPrice = cart.Sum(c => c.Subtotal);

            AnsiConsole.WriteLine();
            AnsiConsole.Write(new Panel(
                $"  [bold green]✓[/] [bold]{product.Name}[/]  [dim](Size: {size}  ×  {qty})[/]\n\n" +
                $"  [dim]Cart: [bold]{totalItems}[/] item{(totalItems == 1 ? "" : "s")} — " +
                $"Total [bold]${totalPrice:F2}[/][/]")
                .Header("[bold green] Added to Cart [/]")
                .BorderColor(Color.Green)
                .Padding(1, 0));
            AnsiConsole.WriteLine();
            PressAnyKey();
        }
    }
}

// ── Cart Flow ─────────────────────────────────────────────────────────────────

void CartFlow()
{
    while (true)
    {
        AnsiConsole.Clear();
        AnsiConsole.Write(new Rule("[bold gold1] Your Cart [/]").RuleStyle("gold1"));
        AnsiConsole.WriteLine();
        ShowCartTable();
        AnsiConsole.WriteLine();

        if (cart.Count == 0)
        {
            PressAnyKey();
            return;
        }

        var action = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("  What would you like to do?")
                .AddChoices("Remove an item", "Clear cart", "← Back to Main Menu"));

        if (action == "← Back to Main Menu") return;

        if (action == "Clear cart")
        {
            if (AnsiConsole.Confirm("  [red]Clear all items from your cart?[/]"))
            {
                cart.Clear();
                AnsiConsole.MarkupLine("\n  [dim]Cart cleared.[/]");
                System.Threading.Thread.Sleep(700);
            }
            return;
        }

        // Remove a single item
        var itemLabels = cart.Select(c => $"{c.Product.Name}  [[{c.Size}]]  × {c.Qty}  (${c.Subtotal:F2})").ToList();
        itemLabels.Add("← Cancel");

        var selected = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("  Select item to [red]remove[/]:")
                .AddChoices(itemLabels));

        if (selected != "← Cancel")
        {
            int idx = itemLabels.IndexOf(selected);
            cart.RemoveAt(idx);
            AnsiConsole.MarkupLine("\n  [green]Item removed.[/]");
            System.Threading.Thread.Sleep(600);
        }
    }
}

// ── Checkout Flow ─────────────────────────────────────────────────────────────

void CheckoutFlow()
{
    AnsiConsole.Clear();
    AnsiConsole.Write(new Rule("[bold gold1] Checkout [/]").RuleStyle("gold1"));
    AnsiConsole.WriteLine();

    if (cart.Count == 0)
    {
        AnsiConsole.Write(new Panel(
            "  [yellow]Your cart is empty![/]\n\n  [dim]Add some items before checking out.[/]")
            .Header("[yellow] Checkout [/]")
            .BorderColor(Color.Yellow)
            .Padding(1, 0));
        AnsiConsole.WriteLine();
        PressAnyKey();
        return;
    }

    // Show cart summary before asking for details
    ShowCartTable();
    AnsiConsole.WriteLine();
    AnsiConsole.Write(new Rule("[dim] Customer Details [/]").RuleStyle("grey"));
    AnsiConsole.WriteLine();

    var name = AnsiConsole.Prompt(
        new TextPrompt<string>("  [bold]Full Name:[/]")
            .PromptStyle("green")
            .Validate(v => !string.IsNullOrWhiteSpace(v)
                ? ValidationResult.Success()
                : ValidationResult.Error("[red]Name cannot be empty[/]")));

    var email = AnsiConsole.Prompt(
        new TextPrompt<string>("  [bold]Email:[/]")
            .PromptStyle("green")
            .Validate(v => v.Contains('@') && v.Contains('.')
                ? ValidationResult.Success()
                : ValidationResult.Error("[red]Enter a valid email address[/]")));

    var address = AnsiConsole.Prompt(
        new TextPrompt<string>("  [bold]Shipping Address:[/]")
            .PromptStyle("green")
            .Validate(v => !string.IsNullOrWhiteSpace(v)
                ? ValidationResult.Success()
                : ValidationResult.Error("[red]Address cannot be empty[/]")));

    AnsiConsole.WriteLine();
    AnsiConsole.MarkupLine("  [dim]Enter promo code for a discount, or leave blank to skip.[/]");
    var promo = AnsiConsole.Prompt(
        new TextPrompt<string>("  [bold]Promo Code:[/]")
            .PromptStyle("gold1")
            .AllowEmpty());

    decimal subtotal = cart.Sum(c => c.Subtotal);
    decimal discount = 0m;
    bool promoApplied = false;

    if (promo.Trim().Equals("SAVE10", StringComparison.OrdinalIgnoreCase))
    {
        discount = Math.Round(subtotal * 0.10m, 2);
        promoApplied = true;
        AnsiConsole.MarkupLine("  [bold green]✓ Promo code applied! 10% off your order.[/]");
    }
    else if (!string.IsNullOrWhiteSpace(promo))
    {
        AnsiConsole.MarkupLine("  [red]✗ Invalid promo code — no discount applied.[/]");
    }

    decimal total = subtotal - discount;
    AnsiConsole.WriteLine();

    // Processing spinner
    AnsiConsole.Status()
        .Spinner(Spinner.Known.Dots)
        .SpinnerStyle(Style.Parse("gold1"))
        .Start("[bold gold1]Processing your order...[/]", ctx =>
        {
            ctx.Status("[gold1]Validating payment details...[/]");
            System.Threading.Thread.Sleep(900);
            ctx.Status("[gold1]Confirming stock availability...[/]");
            System.Threading.Thread.Sleep(700);
            ctx.Status("[gold1]Generating your confirmation...[/]");
            System.Threading.Thread.Sleep(600);
        });

    AnsiConsole.WriteLine();

    // Build confirmation panel
    string orderNo  = $"BQ-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
    string delivery = DateTime.Now.AddDays(Random.Shared.Next(3, 7)).ToString("dddd, MMMM d");

    var sb = new StringBuilder();
    sb.AppendLine($"  [bold gold1]Order # {orderNo}[/]\n");
    sb.AppendLine($"  [bold]Name:[/]      {name}");
    sb.AppendLine($"  [bold]Email:[/]     {email}");
    sb.AppendLine($"  [bold]Ship to:[/]   {address}\n");

    sb.AppendLine("  [bold]Items ordered:[/]");
    foreach (var item in cart)
        sb.AppendLine($"    • {item.Product.Name}  [[{item.Size}]]  × {item.Qty}  [dim]${item.Subtotal:F2}[/]");

    sb.AppendLine();
    sb.AppendLine($"  [grey]Subtotal:[/]   [bold]${subtotal:F2}[/]");
    if (promoApplied)
        sb.AppendLine($"  [grey]Discount:[/]   [bold green]-${discount:F2}[/]  [dim](SAVE10)[/]");
    sb.AppendLine($"  [grey]Shipping:[/]   [bold green]FREE[/]");
    sb.AppendLine($"\n  [bold gold1]ORDER TOTAL:  ${total:F2}[/]\n");
    sb.AppendLine($"  [dim]Estimated delivery: [bold]{delivery}[/][/]");
    sb.AppendLine($"  [dim]Confirmation sent to [bold]{email}[/][/]");

    AnsiConsole.Write(new Panel(sb.ToString().TrimEnd())
        .Header("[bold green] ✓ Order Confirmed! Thank you for shopping at Boutique! [/]")
        .BorderColor(Color.Green)
        .Padding(0, 1));

    cart.Clear();

    AnsiConsole.WriteLine();
    PressAnyKey();
}

// ── Main Loop ─────────────────────────────────────────────────────────────────

ShowWelcome();
PressAnyKey();

while (true)
{
    AnsiConsole.Clear();
    AnsiConsole.Write(new Rule("[bold deeppink1] ✦ BOUTIQUE ✦ [/]").RuleStyle("grey"));
    AnsiConsole.WriteLine();

    int     cartCount = cart.Sum(c => c.Qty);
    decimal cartTotal = cart.Sum(c => c.Subtotal);

    string cartLabel = cartCount > 0
        ? $"View Cart   ({cartCount} item{(cartCount == 1 ? "" : "s")} — ${cartTotal:F2})"
        : "View Cart   (empty)";

    var choice = AnsiConsole.Prompt(
        new SelectionPrompt<string>()
            .Title("  [bold]Main Menu[/] — what would you like to do?")
            .AddChoices("Browse Store", cartLabel, "Checkout", "Exit"));

    if      (choice.StartsWith("Browse Store")) BrowseFlow();
    else if (choice.StartsWith("View Cart"))    CartFlow();
    else if (choice == "Checkout")              CheckoutFlow();
    else
    {
        AnsiConsole.Clear();
        AnsiConsole.Write(new FigletText("Goodbye!").Color(Color.HotPink));
        AnsiConsole.MarkupLine(
            "[dim]Thank you for shopping at Boutique.\n" +
            "See you next time! [bold deeppink1]♡[/][/]\n");
        break;
    }
}

// ── Data Models ──────────────────────────────────────────────────────────────

record Product(
    int Id,
    string Name,
    string Category,
    decimal Price,
    string Description,
    string[] Sizes,
    bool IsOnSale = false,
    int DiscountPercent = 0)
{
    public decimal SalePrice => IsOnSale
        ? Math.Round(Price * (1 - DiscountPercent / 100m), 2)
        : Price;

    public string DisplayPrice => IsOnSale
        ? $"[grey strikethrough]${Price:F2}[/] [bold red]${SalePrice:F2}[/] [bold red]-{DiscountPercent}%[/]"
        : $"[bold green]${Price:F2}[/]";
}

record CartItem(Product Product, string Size, int Qty)
{
    public decimal Subtotal => Product.SalePrice * Qty;
}
