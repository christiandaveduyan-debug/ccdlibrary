use crate::api::auth::{delete_user, get_users, login_handler, signup_handler, update_user};
use crate::api::library::{
    // Author endpoints
    add_author,
    // Book endpoints
    add_book,
    // Category endpoints
    add_category,
    // Member endpoints
    add_member,
    // Publisher endpoints
    add_publisher,
    // Borrow/Return endpoints
    borrow_book,
    delete_author,
    delete_book,
    delete_category,
    delete_member,
    delete_publisher,
    get_authors,
    // GET endpoints
    get_books,
    get_categories,
    get_members,
    get_publishers,
    return_book,
    update_author,
    update_book,
    update_category,
    update_member,
    update_publisher,
};
use crate::api::AppState;
use axum::{
    Json,
    routing::{get, post, put},
    Router,
};
use serde_json::{json, Value};

async fn health_check() -> Json<Value> {
    Json(json!({
        "success": true,
        "service": "ccdlib-api"
    }))
}

async fn root_check() -> Json<Value> {
    Json(json!({
        "success": true,
        "service": "ccdlib-api",
        "message": "Backend is running",
        "health": "/api/health"
    }))
}

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(root_check))
        .route("/api/health", get(health_check))
        // Auth routes
        .route("/api/login", post(login_handler))
        .route("/api/signup", post(signup_handler))
        .route("/api/users", get(get_users))
        .route("/api/users/{id}", put(update_user).delete(delete_user))
        // Book routes
        .route("/api/books", get(get_books).post(add_book))
        .route("/api/books/{id}", put(update_book).delete(delete_book))
        // Member routes
        .route("/api/members", get(get_members).post(add_member))
        .route(
            "/api/members/{id}",
            put(update_member).delete(delete_member),
        )
        // Category routes
        .route("/api/categories", get(get_categories).post(add_category))
        .route(
            "/api/categories/{id}",
            put(update_category).delete(delete_category),
        )
        // Author routes
        .route("/api/authors", get(get_authors).post(add_author))
        .route(
            "/api/authors/{id}",
            put(update_author).delete(delete_author),
        )
        // Publisher routes
        .route("/api/publishers", get(get_publishers).post(add_publisher))
        .route(
            "/api/publishers/{id}",
            put(update_publisher).delete(delete_publisher),
        )
        // Borrow/Return routes
        .route("/api/borrow", post(borrow_book))
        .route("/api/return", post(return_book))
}
