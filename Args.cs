
if (args.Length < 2)
    return;

bool hasKey = bool.Parse(args[0]);
var hasValue = bool.Parse(args[1]);

if (hasKey ^ hasValue)
{
    Console.WriteLine("You have either a key or a value, but not both.");
}
else
{
    Console.WriteLine("You either have both a key and a value, or you have neither.");
}