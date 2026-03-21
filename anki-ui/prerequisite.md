# Prerequisites

## 1. Anki Desktop

Anki must be running while using this app.

Download: https://apps.ankiweb.net

---

## 2. AnkiConnect Add-on

AnkiConnect exposes a local REST API that this app communicates with.

**Install:**
1. Open Anki → **Tools** → **Add-ons** → **Get Add-ons...**
2. Enter code: `2055492159`
3. Restart Anki

---

## 3. CORS Configuration

AnkiConnect must allow requests from this app's origin.

**Steps:**
1. Open Anki → **Tools** → **Add-ons**
2. Select **AnkiConnect** → click **Config**
3. Add `"http://localhost:5107"` to the `webCorsOriginList` array:

```json
{
  "webCorsOriginList": [
    "http://localhost",
    "http://localhost:5107"
  ]
}
```

4. Click **OK**
5. Restart Anki

---

## 4. Running the App

```bash
dotnet run anki-ui/App.cs
```

Then open: http://localhost:5107
