# CCD Library Backend

A Rust-based REST API for the City College of Davao Library Management System.

## Quick Start

### Prerequisites
- Rust 1.70+ ([Install](https://rustup.rs/))
- PostgreSQL database or Supabase account
- dotenv file with credentials

### Installation

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your database URL:**
   ```env
   DATABASE_URL=postgresql://postgres:password@supabase.co:5432/postgres
   PORT=8000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your-secret-key
   ```

3. **Set up database:**
   - Run `schema.sql` in your PostgreSQL/Supabase instance
   - This creates all necessary tables

4. **Build the project:**
   ```bash
   cargo build --release
   ```

5. **Run the server:**
   ```bash
   cargo run
   ```

   Server will start at `http://localhost:8000`

## Development

### Run in development mode:
```bash
cargo run
```

### Run tests:
```bash
cargo test
```

### Build for production:
```bash
cargo build --release
```

## API Documentation

All endpoints require authentication via JWT tokens (except login/signup).

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Resource Endpoints
- `/api/books` - Book management
- `/api/members` - Member management
- `/api/categories` - Category management
- `/api/authors` - Author management
- `/api/publishers` - Publisher management
- `/api/borrow` - Book borrowing
- `/api/return` - Book returns

See [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) for detailed endpoint documentation.

## Features

- ✅ JWT Authentication
- ✅ PostgreSQL Integration
- ✅ Connection Pooling
- ✅ CORS Support
- ✅ Rate Limiting
- ✅ Comprehensive Error Handling
- ✅ Bcrypt Password Hashing
- ✅ Activity Logging

## Project Structure

```
src/
├── main.rs          # Entry point
├── db.rs            # Database initialization
├── engine.rs        # Server setup
├── limiter.rs       # Rate limiting
├── api/
│   ├── auth.rs      # Authentication
│   └── library.rs   # Library operations
├── routes/
│   └── auth_routes.rs # Route definitions
└── security/
    └── mod.rs       # JWT & security
```

## Dependencies

- `axum` - Web framework
- `tokio` - Async runtime
- `sqlx` - SQL query builder
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT handling
- `serde` - Serialization
- `tower-http` - HTTP middleware

See [Cargo.toml](Cargo.toml) for complete dependency list.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | - | PostgreSQL connection string |
| PORT | 8000 | Server port |
| CLIENT_URL | http://localhost:5173 | Frontend URL for CORS |
| JWT_SECRET | - | Secret key for JWT signing |
| ALLOWED_ORIGINS | - | Comma-separated CORS origins |

## Troubleshooting

### Connection Refused
- Verify DATABASE_URL is correct
- Check PostgreSQL/Supabase is running
- Ensure network allows database connections

### JWT Errors
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure token hasn't expired

### Database Errors
- Run schema.sql in database
- Check all tables exist
- Verify column types match queries

## Deployment

### Vercel
```bash
vercel deploy
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Docker
```bash
docker build -t ccd-library-backend .
docker run -p 8000:8000 ccd-library-backend
```

## Performance

- Connection pooling: 5-10 connections
- Request timeout: 30 seconds
- Max concurrent requests: 100 (limited)
- Database query cache: Disabled for real-time data

## Security

- All passwords hashed with bcrypt
- JWT expires after 24 hours
- SQL injection prevention via parameterized queries
- CORS headers validated
- Request rate limiting enabled
- TLS support for database connections

## License

MIT License - See LICENSE file
