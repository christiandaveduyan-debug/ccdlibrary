pub mod api;
pub mod db;
pub mod limiter;
pub mod routes;
pub mod security;

use axum::{
    http::{HeaderValue, Method},
    middleware::{self},
    Extension,
};
use dotenvy::dotenv;
use std::{collections::HashSet, env};

use db::init_db_pool;
use limiter::{enforce_concurrency, ConcurrencyLimiter};
use routes::auth_routes::auth_routes;
use tower_http::{
    cors::{AllowOrigin, CorsLayer},
    set_header::SetResponseHeaderLayer,
    trace::TraceLayer,
};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let mut allowed_origins = HashSet::from([
        "http://localhost:5173".to_string(),
        "https://ccdlib.vercel.app".to_string(),
    ]);

    if let Ok(client_url) = env::var("CLIENT_URL") {
        allowed_origins.insert(client_url);
    }

    if let Ok(origins) = env::var("ALLOWED_ORIGINS") {
        allowed_origins.extend(
            origins
                .split(',')
                .map(str::trim)
                .filter(|origin| !origin.is_empty())
                .map(str::to_string),
        );
    }

    let allowed_origins: HashSet<HeaderValue> = allowed_origins
        .into_iter()
        .filter_map(|origin| origin.parse::<HeaderValue>().ok())
        .collect();
    let limiter = ConcurrencyLimiter::new(5);

    let port = env::var("PORT").unwrap_or_else(|_| "8000".to_string());

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::predicate(move |origin, _| {
            allowed_origins.contains(origin)
        }))
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
            axum::http::header::ACCEPT,
            axum::http::header::ACCEPT_LANGUAGE,
            axum::http::header::ACCEPT_ENCODING,
        ])
        .allow_credentials(true);

    let db_pool = init_db_pool().await;

    let jwt_secret = env::var("JWT_SECRET")
        .unwrap_or_else(|_| "default_secret_key_change_me_in_production".to_string());
    let state = api::auth::AppState {
        db: db_pool.clone(),
        jwt_secret,
    };

    let app = auth_routes()
        .with_state(state)
        .layer(Extension(db_pool))
        // .route_layer(middleware::from_fn_with_state(
        //     allowed_origin.clone()
        // ))
        .layer(middleware::from_fn(move |req, next| {
            enforce_concurrency(limiter.clone(), req, next)
        }))
        .layer(cors)
        .layer(SetResponseHeaderLayer::if_not_present(
            axum::http::header::STRICT_TRANSPORT_SECURITY,
            axum::http::HeaderValue::from_static("max-age=31536000; includeSubDomains"),
        ))
        .layer(TraceLayer::new_for_http());

    let addr = format!("0.0.0.0:{}", port);
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
