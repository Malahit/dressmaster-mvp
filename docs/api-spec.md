# API Spec v0

Base URL: https://api.example.com (dev: http://localhost:3000)

Auth: Bearer JWT

## Auth
- POST /auth/register { email, password } -> 200 { token }
- POST /auth/login { email, password } -> 200 { token }
- GET /me -> 200 { id, email }

## Items
- GET /items -> 200 [Item]
- POST /items -> 201 Item
- PATCH /items/:id -> 200 Item
- DELETE /items/:id -> 204

Item: { id, category: 'top'|'bottom'|'shoes'|'accessory', color?, season?: 'S'|'F'|'W'|'SS', formality?: 1..5, imageUrl? }

## Outfits
- POST /outfits/generate { occasion: 'work'|'date'|'sport', temp?: number } -> 200 [Outfit] (max 3)
- POST /outfits { items: {topId,bottomId,shoesId,accessoryIds?}, occasion? } -> 201 Outfit
- GET /outfits -> 200 [Outfit]

## Calendar
- GET /calendar?month=YYYY-MM -> 200 [CalendarEntry]
- POST /calendar { date, outfitId } -> 201 CalendarEntry
- DELETE /calendar/:id -> 204
