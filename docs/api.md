# DressMaster API Documentation

Base URL: `https://api.dressmaster.com` (Development: `http://localhost:3000`)

Authentication: Bearer JWT token in `Authorization` header

## Table of Contents
- [Authentication](#authentication)
- [Items Management](#items-management)
- [Outfits](#outfits)
- [Calendar](#calendar)
- [Health Check](#health-check)

---

## Authentication

### Register a New User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account and receive an authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `409 Conflict`: Email already exists

**Example curl request:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate an existing user and receive an authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Invalid credentials

**Example curl request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### Get Current User

**Endpoint:** `GET /me`

**Description:** Get the authenticated user's information.

**Authentication:** Required

**Success Response (200):**
```json
{
  "id": "clxyz123abc",
  "email": "user@example.com"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

**Example curl request:**
```bash
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Items Management

### List All Items

**Endpoint:** `GET /items`

**Description:** Retrieve all wardrobe items for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": "item_123",
    "category": "top",
    "color": "blue",
    "season": "SS",
    "formality": 3,
    "imageUrl": "https://example.com/image.jpg",
    "userId": "user_123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Example curl request:**
```bash
curl -X GET http://localhost:3000/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Create a New Item

**Endpoint:** `POST /items`

**Description:** Add a new item to the user's wardrobe.

**Authentication:** Required

**Request Body:**
```json
{
  "category": "top",
  "color": "blue",
  "season": "SS",
  "formality": 3,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Field Descriptions:**
- `category` (required): One of `top`, `bottom`, `shoes`, `accessory`
- `color` (optional): Color of the item
- `season` (optional): Season code - `S` (Spring), `SS` (Summer), `F` (Fall), `W` (Winter)
- `formality` (optional): Formality level from 1 (casual) to 5 (formal)
- `imageUrl` (optional): URL to the item's image

**Success Response (201):**
```json
{
  "id": "item_123",
  "category": "top",
  "color": "blue",
  "season": "SS",
  "formality": 3,
  "imageUrl": "https://example.com/image.jpg",
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token

**Example curl request:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "top",
    "color": "blue",
    "season": "SS",
    "formality": 3,
    "imageUrl": "https://example.com/image.jpg"
  }'
```

---

### Update an Item

**Endpoint:** `PATCH /items/:id`

**Description:** Update an existing wardrobe item. Only provided fields will be updated.

**Authentication:** Required

**URL Parameters:**
- `id`: The item ID

**Request Body (all fields optional):**
```json
{
  "color": "red",
  "formality": 4
}
```

**Success Response (200):**
```json
{
  "id": "item_123",
  "category": "top",
  "color": "red",
  "season": "SS",
  "formality": 4,
  "imageUrl": "https://example.com/image.jpg",
  "userId": "user_123",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Item not found

**Example curl request:**
```bash
curl -X PATCH http://localhost:3000/items/item_123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "red",
    "formality": 4
  }'
```

---

### Delete an Item

**Endpoint:** `DELETE /items/:id`

**Description:** Remove an item from the wardrobe.

**Authentication:** Required

**URL Parameters:**
- `id`: The item ID

**Success Response (204):**
No content

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Item not found

**Example curl request:**
```bash
curl -X DELETE http://localhost:3000/items/item_123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Outfits

### Generate Outfit Suggestions

**Endpoint:** `POST /outfits/generate`

**Description:** Generate outfit suggestions based on occasion and optional temperature. Returns up to 3 outfit suggestions.

**Authentication:** Required

**Request Body:**
```json
{
  "occasion": "work",
  "temp": 22
}
```

**Field Descriptions:**
- `occasion` (required): One of `work`, `date`, `sport`
- `temp` (optional): Temperature in Celsius

**Success Response (200):**
```json
[
  {
    "top": { "id": "item_1", "category": "top", "color": "white" },
    "bottom": { "id": "item_2", "category": "bottom", "color": "black" },
    "shoes": { "id": "item_3", "category": "shoes", "color": "brown" },
    "accessories": []
  }
]
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token

**Example curl request:**
```bash
curl -X POST http://localhost:3000/outfits/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "occasion": "work",
    "temp": 22
  }'
```

---

### Create an Outfit

**Endpoint:** `POST /outfits`

**Description:** Save a custom outfit combination.

**Authentication:** Required

**Request Body:**
```json
{
  "items": {
    "topId": "item_1",
    "bottomId": "item_2",
    "shoesId": "item_3",
    "accessoryIds": ["item_4"]
  },
  "occasion": "work"
}
```

**Field Descriptions:**
- `items.topId` (required): ID of the top item
- `items.bottomId` (required): ID of the bottom item
- `items.shoesId` (required): ID of the shoes item
- `items.accessoryIds` (optional): Array of accessory item IDs
- `occasion` (optional): Occasion label for the outfit

**Success Response (201):**
```json
{
  "id": "outfit_123",
  "userId": "user_123",
  "topId": "item_1",
  "bottomId": "item_2",
  "shoesId": "item_3",
  "accessoryIds": ["item_4"],
  "occasion": "work",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token

**Example curl request:**
```bash
curl -X POST http://localhost:3000/outfits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": {
      "topId": "item_1",
      "bottomId": "item_2",
      "shoesId": "item_3",
      "accessoryIds": ["item_4"]
    },
    "occasion": "work"
  }'
```

---

### List All Outfits

**Endpoint:** `GET /outfits`

**Description:** Retrieve all saved outfits for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": "outfit_123",
    "userId": "user_123",
    "topId": "item_1",
    "bottomId": "item_2",
    "shoesId": "item_3",
    "accessoryIds": ["item_4"],
    "occasion": "work",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Example curl request:**
```bash
curl -X GET http://localhost:3000/outfits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Calendar

### Get Calendar Entries

**Endpoint:** `GET /calendar`

**Description:** Retrieve calendar entries, optionally filtered by month.

**Authentication:** Required

**Query Parameters:**
- `month` (optional): Month filter in `YYYY-MM` format (e.g., `2024-01`)

**Success Response (200):**
```json
[
  {
    "id": "cal_123",
    "userId": "user_123",
    "outfitId": "outfit_123",
    "date": "2024-01-15T00:00:00Z",
    "createdAt": "2024-01-14T10:30:00Z"
  }
]
```

**Example curl requests:**
```bash
# Get all calendar entries
curl -X GET http://localhost:3000/calendar \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get calendar entries for a specific month
curl -X GET "http://localhost:3000/calendar?month=2024-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Create a Calendar Entry

**Endpoint:** `POST /calendar`

**Description:** Schedule an outfit for a specific date.

**Authentication:** Required

**Request Body:**
```json
{
  "date": "2024-01-15",
  "outfitId": "outfit_123"
}
```

**Field Descriptions:**
- `date` (required): ISO date string
- `outfitId` (required): ID of the outfit to schedule

**Success Response (201):**
```json
{
  "id": "cal_123",
  "userId": "user_123",
  "outfitId": "outfit_123",
  "date": "2024-01-15T00:00:00Z",
  "createdAt": "2024-01-14T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token

**Example curl request:**
```bash
curl -X POST http://localhost:3000/calendar \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "outfitId": "outfit_123"
  }'
```

---

### Delete a Calendar Entry

**Endpoint:** `DELETE /calendar/:id`

**Description:** Remove a calendar entry.

**Authentication:** Required

**URL Parameters:**
- `id`: The calendar entry ID

**Success Response (204):**
No content

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Calendar entry not found

**Example curl request:**
```bash
curl -X DELETE http://localhost:3000/calendar/cal_123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Health Check

### Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API service is running.

**Authentication:** Not required

**Success Response (200):**
```json
{
  "ok": true
}
```

**Example curl request:**
```bash
curl -X GET http://localhost:3000/health
```

---

## Error Handling

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "invalid_body"
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "not_found"
}
```

### 409 Conflict
```json
{
  "error": "email_exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_server_error"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. This may change in future versions.

## Pagination

Currently, pagination is not implemented. All list endpoints return all matching records. This may change in future versions.
