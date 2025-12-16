# API Reference

This document describes the REST API endpoints available in Daily Methods Hub.

## Authentication

All API endpoints require authentication via Supabase. The session is managed through cookies.

**Admin-only endpoints** require the authenticated user to have `is_admin = true` in their profile.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Endpoints

### Methods

#### List Methods

Get a paginated list of methods with optional filtering.

```http
GET /api/methods
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by category (e.g., "surveys", "cashback") |
| `difficulty` | string | No | Filter by difficulty ("beginner", "intermediate", "advanced") |
| `isActive` | boolean | No | Filter by active status (true/false) |

**Response:**

```json
{
  "methods": [
    {
      "id": "uuid",
      "title": "Swagbucks Surveys",
      "description": "Complete surveys to earn points redeemable for gift cards or cash",
      "category": "surveys",
      "earnings": "$5-50/day",
      "difficulty": "beginner",
      "timeRequired": "15-30 mins",
      "link": "https://swagbucks.com",
      "iconUrl": "https://example.com/icon.png",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25
}
```

**Example Requests:**

```bash
# Get all methods
curl http://localhost:3000/api/methods

# Filter by category
curl "http://localhost:3000/api/methods?category=surveys"

# Filter by difficulty and active status
curl "http://localhost:3000/api/methods?difficulty=beginner&isActive=true"

# Multiple filters
curl "http://localhost:3000/api/methods?category=cashback&difficulty=intermediate&isActive=true"
```

---

#### Create Method

Create a new earning method (admin only).

```http
POST /api/methods
```

**Authorization:** Admin required

**Request Body:**

```json
{
  "title": "Swagbucks Surveys",
  "description": "Complete surveys to earn points redeemable for gift cards or cash",
  "category": "surveys",
  "earnings": "$5-50/day",
  "difficulty": "beginner",
  "timeRequired": "15-30 mins",
  "link": "https://swagbucks.com",
  "iconUrl": "https://example.com/icon.png",
  "isActive": true
}
```

**Field Validations:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1-200 characters |
| `description` | string | Yes | 1-1000 characters |
| `category` | string | Yes | One of: surveys, cashback, freelance, investing, passive, other |
| `earnings` | string | Yes | Format: "$X-Y/period" |
| `difficulty` | string | Yes | One of: beginner, intermediate, advanced |
| `timeRequired` | string | Yes | Format: "X-Y mins/hours" |
| `link` | string | No | Valid URL |
| `iconUrl` | string | No | Valid URL |
| `isActive` | boolean | No | Defaults to true |

**Response (201 Created):**

```json
{
  "id": "uuid",
  "title": "Swagbucks Surveys",
  "description": "Complete surveys to earn points redeemable for gift cards or cash",
  "category": "surveys",
  "earnings": "$5-50/day",
  "difficulty": "beginner",
  "timeRequired": "15-30 mins",
  "link": "https://swagbucks.com",
  "iconUrl": "https://example.com/icon.png",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

```json
// 401 Unauthorized - Not logged in
{
  "error": "Unauthorized"
}

// 403 Forbidden - Not an admin
{
  "error": "Forbidden: Admin access required"
}

// 400 Bad Request - Validation error
{
  "error": "Invalid request body"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/methods \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Swagbucks Surveys",
    "description": "Complete surveys to earn points",
    "category": "surveys",
    "earnings": "$5-50/day",
    "difficulty": "beginner",
    "timeRequired": "15-30 mins",
    "link": "https://swagbucks.com"
  }'
```

---

#### Get Method by ID

Get details of a specific method.

```http
GET /api/methods/:id
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Method ID |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Swagbucks Surveys",
  "description": "Complete surveys to earn points redeemable for gift cards or cash",
  "category": "surveys",
  "earnings": "$5-50/day",
  "difficulty": "beginner",
  "timeRequired": "15-30 mins",
  "link": "https://swagbucks.com",
  "iconUrl": "https://example.com/icon.png",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Method not found"
}
```

**Example Request:**

```bash
curl http://localhost:3000/api/methods/550e8400-e29b-41d4-a716-446655440000
```

---

#### Update Method

Update an existing method (admin only).

```http
PATCH /api/methods/:id
```

**Authorization:** Admin required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Method ID |

**Request Body:**

Send only the fields you want to update. All fields are optional.

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "category": "surveys",
  "earnings": "$5-50/day",
  "difficulty": "beginner",
  "timeRequired": "15-30 mins",
  "link": "https://swagbucks.com",
  "iconUrl": "https://example.com/icon.png",
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:45:00Z"
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden: Admin access required"
}

// 404 Not Found
{
  "error": "Method not found"
}
```

**Example Request:**

```bash
curl -X PATCH http://localhost:3000/api/methods/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

---

#### Delete Method

Delete a method (admin only).

```http
DELETE /api/methods/:id
```

**Authorization:** Admin required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Method ID |

**Response (200 OK):**

```json
{
  "message": "Method deleted successfully"
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden: Admin access required"
}

// 404 Not Found
{
  "error": "Method not found"
}
```

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/methods/550e8400-e29b-41d4-a716-446655440000
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request body or parameters |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Authenticated but not authorized (not an admin) |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

Error responses always include an `error` field with a descriptive message:

```json
{
  "error": "Description of what went wrong"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production deployments, consider:

- Using Supabase's built-in rate limiting
- Adding Vercel Edge Middleware rate limiting
- Implementing custom rate limiting with Redis

---

## Authentication Flow

The API uses Supabase Auth with cookie-based sessions:

1. **Login**: POST to `/login` with email/password
2. **Session**: Cookies are automatically set and sent with each request
3. **Authorization**: Middleware checks `is_admin` flag for protected routes
4. **Logout**: Cookies are cleared on sign out

**Testing with cURL:**

Since the API uses HTTP-only cookies, you need to preserve cookies between requests:

```bash
# Login and save cookies
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -c cookies.txt

# Use cookies in subsequent requests
curl http://localhost:3000/api/methods \
  -b cookies.txt
```

**Testing with Postman:**

Postman automatically handles cookies. Just:
1. Login via the web UI
2. Postman will capture the session cookies
3. Use them for API requests

---

## Server Actions vs REST API

This project provides both **Server Actions** and **REST API** endpoints:

### Server Actions (Recommended)

Located in `app/actions/methods.ts`:
- `getMethods()` - List methods
- `getMethodById(id)` - Get method details
- `createMethod(data)` - Create method
- `updateMethod(id, data)` - Update method
- `deleteMethod(id)` - Delete method

**Use Server Actions when:**
- Building Next.js pages and components
- You want type-safe, direct server function calls
- You need automatic revalidation
- Working within the Next.js ecosystem

### REST API

Located in `app/api/methods/`:
- More flexible for external integrations
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Easy to test with tools like curl, Postman
- Works with any HTTP client

**Use REST API when:**
- Building a mobile app or external client
- Integrating with third-party services
- Need standard REST conventions
- Testing with HTTP tools

Both approaches use the same underlying Supabase database and enforce the same authorization rules.

---

## Examples

### Fetch all active methods

```javascript
const response = await fetch('/api/methods?isActive=true')
const data = await response.json()
console.log(data.methods)
```

### Create a new method

```javascript
const response = await fetch('/api/methods', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Method',
    description: 'Description here',
    category: 'surveys',
    earnings: '$10-20/day',
    difficulty: 'beginner',
    timeRequired: '30 mins'
  })
})

if (response.ok) {
  const method = await response.json()
  console.log('Created:', method)
}
```

### Update a method

```javascript
const response = await fetch(`/api/methods/${methodId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    isActive: false
  })
})

const updated = await response.json()
```

### Delete a method

```javascript
const response = await fetch(`/api/methods/${methodId}`, {
  method: 'DELETE'
})

if (response.ok) {
  console.log('Method deleted')
}
```

---

## Next Steps

- Implement pagination for list endpoints
- Add search functionality
- Create bulk operations endpoints
- Add webhooks for method changes
- Implement GraphQL API alternative

---

For more information, see:
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Development Guide](./DEVELOPMENT.md)
- [Project Structure](./STRUCTURE.md)
