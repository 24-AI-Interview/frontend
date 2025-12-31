# Auth API Spec

Base URL: `/api`

## Common
- `Content-Type: application/json`
- Error response format

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect.",
    "details": null
  }
}
```

## POST /auth/signup
Create a new user account.

Request

```json
{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "string",
  "passwordConfirm": "string",
  "phone": "010-0000-0000",
  "agree": true
}
```

Response 201

```json
{
  "user": {
    "id": "usr_123",
    "name": "홍길동",
    "email": "user@example.com",
    "phone": "010-0000-0000",
    "createdAt": "2024-01-10T12:00:00Z"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

Errors
- `400` `INVALID_INPUT`
- `409` `EMAIL_ALREADY_EXISTS`

## POST /auth/login
Authenticate user credentials.

Request

```json
{
  "email": "user@example.com",
  "password": "string",
  "remember": true
}
```

Response 200

```json
{
  "user": {
    "id": "usr_123",
    "name": "홍길동",
    "email": "user@example.com",
    "lastLoginAt": "2024-01-10T12:00:00Z"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

Errors
- `400` `INVALID_INPUT`
- `401` `INVALID_CREDENTIALS`
- `423` `ACCOUNT_LOCKED`

## POST /auth/logout
Invalidate current refresh token.

Request

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response 204

No body.

Errors
- `401` `UNAUTHORIZED`

## POST /auth/refresh
Issue a new access token.

Request

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response 200

```json
{
  "accessToken": "jwt-access-token",
  "expiresIn": 3600
}
```

Errors
- `401` `INVALID_REFRESH_TOKEN`

## GET /auth/me
Fetch current user profile.

Response 200

```json
{
  "id": "usr_123",
  "name": "홍길동",
  "email": "user@example.com",
  "phone": "010-0000-0000",
  "createdAt": "2024-01-10T12:00:00Z"
}
```

Errors
- `401` `UNAUTHORIZED`
