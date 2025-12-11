# API Documentation

## Base URL

```
Development: http://localhost:8080/api/v1
Production: https://api.example.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this structure:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

## Endpoints

### Health Check

Check if the API is running.

**GET** `/health`

**Response**
```json
{
  "status": "healthy",
  "service": "api"
}
```

**Example**
```bash
curl http://localhost:8080/api/v1/health
```

---

### Ping

Simple ping endpoint.

**GET** `/ping`

**Response**
```json
{
  "message": "pong"
}
```

**Example**
```bash
curl http://localhost:8080/api/v1/ping
```

---

## Authentication Endpoints

### Register

Register a new user account.

**POST** `/auth/register`

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Validation Rules**
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `name`: Required

**Response** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response** `400 Bad Request`
```json
{
  "error": "Email already exists"
}
```

**Example**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

---

### Login

Authenticate and receive JWT tokens.

**POST** `/auth/login`

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Validation Rules**
- `email`: Required, valid email format
- `password`: Required

**Response** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** `401 Unauthorized`
```json
{
  "error": "Invalid credentials"
}
```

**Example**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### Refresh Token

Get a new access token using a refresh token.

**POST** `/auth/refresh`

**Request Body**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** `401 Unauthorized`
```json
{
  "error": "Invalid or expired refresh token"
}
```

**Example**
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your-refresh-token"
  }'
```

---

## User Endpoints

### Get Profile

Get the authenticated user's profile.

**GET** `/profile`

**Authentication Required:** Yes

**Response** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Error Response** `401 Unauthorized`
```json
{
  "error": "Authorization header required"
}
```

**Example**
```bash
curl http://localhost:8080/api/v1/profile \
  -H "Authorization: Bearer your-jwt-token"
```

---

## Payment Endpoints (QRIS)

### Create QRIS Payment

Create a new QRIS payment transaction.

**POST** `/payments/qris/create`

**Authentication Required:** Yes

**Request Body**
```json
{
  "amount": 100000,
  "description": "Payment for order #123",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

**Validation Rules**
- `amount`: Required, positive integer (in smallest currency unit)
- `description`: Required, max 255 characters
- `customer_name`: Optional
- `customer_email`: Optional, valid email if provided

**Response** `201 Created`
```json
{
  "transaction_id": "TRX123456789",
  "qr_code": "base64_encoded_qr_image",
  "qr_string": "00020101021126...",
  "amount": 100000,
  "status": "pending",
  "expires_at": "2024-01-01T12:00:00Z"
}
```

**Example**
```bash
curl -X POST http://localhost:8080/api/v1/payments/qris/create \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "description": "Payment for order #123"
  }'
```

---

### Check Payment Status

Check the status of a QRIS payment.

**GET** `/payments/qris/:transaction_id`

**Authentication Required:** Yes

**Path Parameters**
- `transaction_id`: The transaction ID

**Response** `200 OK`
```json
{
  "transaction_id": "TRX123456789",
  "amount": 100000,
  "status": "paid",
  "paid_at": "2024-01-01T11:30:00Z"
}
```

**Status Values**
- `pending`: Payment not yet completed
- `paid`: Payment successful
- `expired`: Payment expired
- `cancelled`: Payment cancelled

**Example**
```bash
curl http://localhost:8080/api/v1/payments/qris/TRX123456789 \
  -H "Authorization: Bearer your-jwt-token"
```

---

### QRIS Webhook

Webhook endpoint for payment provider callbacks.

**POST** `/webhooks/qris`

**Authentication:** Provider signature verification

**Request Body**
```json
{
  "transaction_id": "TRX123456789",
  "status": "paid",
  "paid_at": "2024-01-01T11:30:00Z",
  "signature": "..."
}
```

**Response** `200 OK`
```json
{
  "message": "Webhook processed"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Request data is invalid |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `ALREADY_EXISTS` | Resource already exists |
| `VALIDATION_ERROR` | Input validation failed |
| `INTERNAL_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

## Rate Limiting

Rate limiting is applied to prevent abuse:

- **Default:** 100 requests per minute per IP
- **Authenticated:** 1000 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

When limit is exceeded:
```
Status: 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

## Pagination

List endpoints support pagination:

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field
- `order`: Sort order (`asc` or `desc`)

**Example**
```bash
curl "http://localhost:8080/api/v1/users?page=2&limit=50&sort=created_at&order=desc" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

## Filtering

List endpoints may support filtering:

**Query Parameters**
- Field-specific filters: `?email=user@example.com`
- Date ranges: `?created_from=2024-01-01&created_to=2024-12-31`
- Search: `?search=keyword`

**Example**
```bash
curl "http://localhost:8080/api/v1/users?search=john&created_from=2024-01-01" \
  -H "Authorization: Bearer your-jwt-token"
```

## Testing

### Using cURL

```bash
# Set variables
API_URL="http://localhost:8080/api/v1"
TOKEN="your-jwt-token"

# Make requests
curl -X GET "$API_URL/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import the API collection (to be provided)
2. Set the environment variables
3. Run requests

### Using JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Make requests
const response = await api.get('/profile');
```

## Webhooks

### Security

Webhook requests include a signature header for verification:

```
X-Webhook-Signature: sha256=...
```

Verify the signature using your webhook secret:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return `sha256=${hash}` === signature;
}
```

### Retry Policy

Failed webhook deliveries are retried:
- Retry intervals: 1m, 5m, 15m, 1h, 6h
- Maximum retries: 5
- Timeout: 30 seconds

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication endpoints
- User management
- QRIS payment integration

## Support

For API support:
- Email: api-support@example.com
- Documentation: https://docs.example.com
- Status: https://status.example.com
