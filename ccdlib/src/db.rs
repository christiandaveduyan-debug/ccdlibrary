use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::time::Duration;

use sqlx::postgres::{PgConnectOptions, PgSslMode};
use std::str::FromStr;

pub async fn init_db_pool() -> PgPool {
    let db_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| {
            eprintln!("❌ ERROR: DATABASE_URL environment variable not set!");
            eprintln!("\nMake sure your .env file contains:");
            eprintln!("  DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres");
            panic!("DATABASE_URL is required to start the application");
        })
        .trim()
        .to_string();

    eprintln!("\n🔗 Attempting to connect to Supabase database...");
    eprintln!("📍 Host: {}", extract_host(&db_url));

    let mut options = match PgConnectOptions::from_str(&db_url) {
        Ok(opts) => opts,
        Err(e) => {
            eprintln!("❌ ERROR: Invalid DATABASE_URL format: {}", e);
            eprintln!("\n✅ Correct format:");
            eprintln!("   postgresql://postgres:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres");
            panic!("Failed to parse DATABASE_URL: {}", e);
        }
    };

    options = options.statement_cache_capacity(0);

    let u = db_url.to_lowercase();
    if u.contains("supabase.co") || u.contains("neon.tech") {
        options = options.ssl_mode(PgSslMode::Require);
        eprintln!("🔒 SSL mode enabled for cloud database");
    }

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(30))
        .idle_timeout(Duration::from_secs(600))
        .max_lifetime(Duration::from_secs(1800))
        .connect_with(options)
        .await;

    match pool {
        Ok(p) => {
            eprintln!("✅ DATABASE CONNECTION SUCCESSFUL!");
            eprintln!("🎉 Ready to accept requests\n");
            p
        }
        Err(e) => {
            eprintln!("\n❌ DATABASE CONNECTION FAILED!");
            eprintln!("\n📋 Error Details:");
            eprintln!("   {}\n", e);

            if e.to_string().contains("password") || e.to_string().contains("auth") {
                eprintln!("🔐 AUTHENTICATION ERROR - Check your password:");
                eprintln!("   1. Go to supabase.com → Your Project → Settings → Database");
                eprintln!("   2. Copy the Connection String (include the password)");
                eprintln!("   3. Update DATABASE_URL in .env file");
                eprintln!("   4. If password has special chars, URL encode them:");
                eprintln!("      @ → %40, # → %23, : → %3A, % → %25\n");
            } else if e.to_string().contains("connect") || e.to_string().contains("timeout") {
                eprintln!("⏱️ CONNECTION TIMEOUT - Check if:");
                eprintln!("   1. Supabase project is active (not paused)");
                eprintln!("   2. Your network allows port 5432 or 6543");
                eprintln!("   3. The hostname is correct\n");
            } else if e.to_string().contains("relation") || e.to_string().contains("does not exist")
            {
                eprintln!("📊 SCHEMA ERROR - Database tables not found:");
                eprintln!("   1. Go to Supabase SQL Editor");
                eprintln!("   2. Create New Query");
                eprintln!("   3. Copy & paste entire schema.sql file");
                eprintln!("   4. Click Run\n");
            }

            panic!("Database connection failed: {}", e);
        }
    }
}

/// Extract hostname from database URL for logging
fn extract_host(db_url: &str) -> String {
    if let Some(start) = db_url.find("@") {
        if let Some(end) = db_url[start..].find("/") {
            return db_url[start + 1..start + end].to_string();
        }
    }
    "unknown".to_string()
}
