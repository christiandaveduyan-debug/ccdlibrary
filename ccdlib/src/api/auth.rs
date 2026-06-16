use crate::security::{create_jwt, Claims};
use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use bcrypt::{hash, verify, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub jwt_secret: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct SignupRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct UserData {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String,
    pub status: String,
}

#[derive(Serialize)]
pub struct TokenResponse {
    pub token: String,
    pub user: UserData,
}

#[derive(Serialize)]
pub struct SignupResponse {
    pub user: UserData,
}

#[derive(Deserialize)]
pub struct UpdateUserRequest {
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub status: Option<String>,
    pub password: Option<String>,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

pub async fn login_handler(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    let email = payload.email.trim().to_lowercase();

    let query_result = sqlx::query(
        "SELECT id::text as id, name, email, password_hash, role, status FROM users WHERE LOWER(email) = $1"
    )
    .bind(&email)
    .fetch_optional(&state.db)
    .await;

    let row = match query_result {
        Ok(Some(row)) => row,
        Ok(None) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(ApiResponse::<TokenResponse> {
                    success: false,
                    message: "Invalid email or password".to_string(),
                    data: None,
                }),
            );
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<TokenResponse> {
                    success: false,
                    message: "Internal server error".to_string(),
                    data: None,
                }),
            );
        }
    };

    let password_hash: String = row.get("password_hash");
    let status: String = row.get("status");

    // Verify password hash
    match verify(&payload.password, &password_hash) {
        Ok(true) => {
            if status != "active" {
                let message = if status == "pending" {
                    "Your account is waiting for admin approval"
                } else {
                    "This account is inactive"
                };

                return (
                    StatusCode::FORBIDDEN,
                    Json(ApiResponse::<TokenResponse> {
                        success: false,
                        message: message.to_string(),
                        data: None,
                    }),
                );
            }

            let user_id: String = row.get("id");
            let user_email: String = row.get("email");
            let user_role: String = row.get("role");

            // Create JWT claims (24 hour expiration)
            let claims = Claims::new(user_id.clone(), user_email.clone(), user_role.clone(), 24);

            // Generate JWT token
            let token = match create_jwt(&claims, &state.jwt_secret) {
                Ok(t) => t,
                Err(err) => {
                    eprintln!("JWT creation error: {}", err);
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ApiResponse::<TokenResponse> {
                            success: false,
                            message: "Failed to create authentication token".to_string(),
                            data: None,
                        }),
                    );
                }
            };

            let user_data = UserData {
                id: user_id,
                name: row.get("name"),
                email: user_email,
                role: user_role,
                status,
            };

            let response = TokenResponse {
                token,
                user: user_data,
            };

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Login successful".to_string(),
                    data: Some(response),
                }),
            )
        }
        _ => (
            StatusCode::UNAUTHORIZED,
            Json(ApiResponse::<TokenResponse> {
                success: false,
                message: "Invalid email or password".to_string(),
                data: None,
            }),
        ),
    }
}

pub async fn signup_handler(
    State(state): State<AppState>,
    Json(payload): Json<SignupRequest>,
) -> impl IntoResponse {
    let name = payload.name.trim();
    let email = payload.email.trim().to_lowercase();
    let password = payload.password.as_str();

    if name.len() < 2 || !email.contains('@') || password.len() < 6 {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<SignupResponse> {
                success: false,
                message: "Please provide a valid name, email, and password".to_string(),
                data: None,
            }),
        );
    }

    // Check if email already exists
    let check_exists = sqlx::query("SELECT 1 FROM users WHERE LOWER(email) = $1")
        .bind(&email)
        .fetch_optional(&state.db)
        .await;

    match check_exists {
        Ok(Some(_)) => {
            return (
                StatusCode::CONFLICT,
                Json(ApiResponse::<SignupResponse> {
                    success: false,
                    message: "Email is already registered".to_string(),
                    data: None,
                }),
            );
        }
        Err(err) => {
            eprintln!("Database error during check: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<SignupResponse> {
                    success: false,
                    message: "Internal server error".to_string(),
                    data: None,
                }),
            );
        }
        _ => {}
    }

    // Hash the password using bcrypt
    let password_hash = match hash(password, DEFAULT_COST) {
        Ok(h) => h,
        Err(err) => {
            eprintln!("Hashing error: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<SignupResponse> {
                    success: false,
                    message: "Internal server error".to_string(),
                    data: None,
                }),
            );
        }
    };

    // Insert user into database as pending. Admin approval activates the account.
    let insert_result = sqlx::query(
        "INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, 'librarian', 'pending') RETURNING id::text as id, name, email, role, status"
    )
    .bind(name)
    .bind(&email)
    .bind(&password_hash)
    .fetch_one(&state.db)
    .await;

    match insert_result {
        Ok(row) => {
            let user_data = UserData {
                id: row.get("id"),
                name: row.get("name"),
                email: row.get("email"),
                role: row.get("role"),
                status: row.get("status"),
            };

            (
                StatusCode::CREATED,
                Json(ApiResponse {
                    success: true,
                    message: "Account request submitted. Please wait for admin approval."
                        .to_string(),
                    data: Some(SignupResponse { user: user_data }),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error during insert: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<SignupResponse> {
                    success: false,
                    message: "Internal server error".to_string(),
                    data: None,
                }),
            );
        }
    }
}

pub async fn get_users(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query(
        "SELECT id::text as id, name, email, role, status FROM users ORDER BY created_at DESC",
    )
    .fetch_all(&state.db)
    .await;

    match result {
        Ok(rows) => {
            let users: Vec<UserData> = rows
                .iter()
                .map(|row| UserData {
                    id: row.get("id"),
                    name: row.get("name"),
                    email: row.get("email"),
                    role: row.get("role"),
                    status: row.get("status"),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Users retrieved successfully".to_string(),
                    data: Some(users),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error retrieving users: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<UserData>> {
                    success: false,
                    message: "Failed to retrieve users".to_string(),
                    data: None,
                }),
            )
        }
    }
}

pub async fn update_user(
    State(state): State<AppState>,
    axum::extract::Path(user_id): axum::extract::Path<String>,
    Json(payload): Json<UpdateUserRequest>,
) -> impl IntoResponse {
    if let Some(role) = &payload.role {
        if !["admin", "librarian", "member"].contains(&role.as_str()) {
            return (
                StatusCode::BAD_REQUEST,
                Json(ApiResponse::<UserData> {
                    success: false,
                    message: "Invalid role".to_string(),
                    data: None,
                }),
            );
        }
    }

    if let Some(status) = &payload.status {
        if !["active", "inactive", "suspended", "pending"].contains(&status.as_str()) {
            return (
                StatusCode::BAD_REQUEST,
                Json(ApiResponse::<UserData> {
                    success: false,
                    message: "Invalid status".to_string(),
                    data: None,
                }),
            );
        }
    }

    let password_hash = match payload.password.as_deref().filter(|password| !password.is_empty()) {
        Some(password) if password.len() < 6 => {
            return (
                StatusCode::BAD_REQUEST,
                Json(ApiResponse::<UserData> {
                    success: false,
                    message: "Password must be at least 6 characters".to_string(),
                    data: None,
                }),
            );
        }
        Some(password) => match hash(password, DEFAULT_COST) {
            Ok(hash) => Some(hash),
            Err(err) => {
                eprintln!("Hashing error: {}", err);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ApiResponse::<UserData> {
                        success: false,
                        message: "Internal server error".to_string(),
                        data: None,
                    }),
                );
            }
        },
        None => None,
    };

    let email = payload.email.as_ref().map(|email| email.trim().to_lowercase());
    let name = payload.name.as_ref().map(|name| name.trim().to_string());

    let result = sqlx::query(
        "UPDATE users SET
            name = COALESCE($2, name),
            email = COALESCE($3, email),
            role = COALESCE($4, role),
            status = COALESCE($5, status),
            password_hash = COALESCE($6, password_hash)
         WHERE id::text = $1
         RETURNING id::text as id, name, email, role, status",
    )
    .bind(&user_id)
    .bind(name)
    .bind(email)
    .bind(&payload.role)
    .bind(&payload.status)
    .bind(password_hash)
    .fetch_optional(&state.db)
    .await;

    match result {
        Ok(Some(row)) => {
            let user = UserData {
                id: row.get("id"),
                name: row.get("name"),
                email: row.get("email"),
                role: row.get("role"),
                status: row.get("status"),
            };

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "User updated successfully".to_string(),
                    data: Some(user),
                }),
            )
        }
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(ApiResponse::<UserData> {
                success: false,
                message: "User not found".to_string(),
                data: None,
            }),
        ),
        Err(err) => {
            eprintln!("Database error updating user: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<UserData> {
                    success: false,
                    message: "Failed to update user".to_string(),
                    data: None,
                }),
            )
        }
    }
}

pub async fn delete_user(
    State(state): State<AppState>,
    axum::extract::Path(user_id): axum::extract::Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM users WHERE id::text = $1")
        .bind(&user_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "User deleted successfully".to_string(),
                data: Some(user_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error deleting user: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete user".to_string(),
                    data: None,
                }),
            )
        }
    }
}
