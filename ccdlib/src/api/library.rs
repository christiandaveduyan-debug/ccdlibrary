use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use bcrypt::{hash, DEFAULT_COST};
use chrono::Local;
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;

use crate::api::AppState;

#[derive(Serialize)]
pub struct BookResponse {
    pub id: String,
    pub title: String,
    pub author_id: Option<String>,
    pub author: Option<String>,
    pub category_id: Option<String>,
    pub category: Option<String>,
    pub publisher_id: Option<String>,
    pub publisher: Option<String>,
    pub isbn: Option<String>,
    pub call_number: Option<String>,
    pub status: String,
    pub location: Option<String>,
    pub published_year: Option<i32>,
    pub copies: i32,
    pub available_copies: i32,
    pub added_date: String,
    pub accession_number: Option<String>,
    pub barcode: Option<String>,
}

#[derive(Serialize)]
pub struct MemberResponse {
    pub id: String,
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub member_type: Option<String>,
    pub joined_date: String,
}

#[derive(Serialize)]
pub struct CategoryResponse {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Serialize)]
pub struct AuthorResponse {
    pub id: String,
    pub name: String,
    pub bio: Option<String>,
    pub nationality: Option<String>,
}

#[derive(Serialize)]
pub struct PublisherResponse {
    pub id: String,
    pub name: String,
    pub address: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
}

// Request structs for creating and updating
#[derive(Deserialize)]
pub struct CreateBookRequest {
    pub title: String,
    pub author_id: Option<String>,
    pub category_id: Option<String>,
    pub publisher_id: Option<String>,
    pub isbn: Option<String>,
    pub call_number: Option<String>,
    pub status: Option<String>,
    pub location: Option<String>,
    pub published_year: Option<i32>,
    pub copies: Option<i32>,
    pub available_copies: Option<i32>,
    pub accession_number: Option<String>,
    pub barcode: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateBookRequest {
    pub title: Option<String>,
    pub author_id: Option<String>,
    pub category_id: Option<String>,
    pub publisher_id: Option<String>,
    pub isbn: Option<String>,
    pub call_number: Option<String>,
    pub status: Option<String>,
    pub location: Option<String>,
    pub published_year: Option<i32>,
    pub copies: Option<i32>,
    pub available_copies: Option<i32>,
    pub accession_number: Option<String>,
    pub barcode: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateMemberRequest {
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub member_type: Option<String>,
    pub password: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateMemberRequest {
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub member_type: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateAuthorRequest {
    pub name: String,
    pub bio: Option<String>,
    pub nationality: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateAuthorRequest {
    pub name: Option<String>,
    pub bio: Option<String>,
    pub nationality: Option<String>,
}

#[derive(Deserialize)]
pub struct CreatePublisherRequest {
    pub name: String,
    pub address: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdatePublisherRequest {
    pub name: Option<String>,
    pub address: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

// GET all books
pub async fn get_books(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query(
        "SELECT b.id::text, b.title, b.author_id::text, a.name AS author, b.category_id::text, c.name AS category, b.publisher_id::text, p.name AS publisher, b.isbn, b.call_number, b.status, b.location, b.published_year, b.copies, b.available_copies, b.added_date::text, b.accession_number, b.barcode
         FROM books b
         LEFT JOIN authors a ON b.author_id = a.id
         LEFT JOIN categories c ON b.category_id = c.id
         LEFT JOIN publishers p ON b.publisher_id = p.id"
    )
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(rows) => {
            let books: Vec<BookResponse> = rows
                .iter()
                .map(|row| BookResponse {
                    id: row.get("id"),
                    title: row.get("title"),
                    author_id: row.try_get("author_id").ok(),
                    author: row.try_get("author").ok(),
                    category_id: row.try_get("category_id").ok(),
                    category: row.try_get("category").ok(),
                    publisher_id: row.try_get("publisher_id").ok(),
                    publisher: row.try_get("publisher").ok(),
                    isbn: row.try_get("isbn").ok(),
                    call_number: row.try_get("call_number").ok(),
                    status: row.get("status"),
                    location: row.try_get("location").ok(),
                    published_year: row.try_get("published_year").ok(),
                    copies: row.get("copies"),
                    available_copies: row.get("available_copies"),
                    added_date: row.try_get("added_date").unwrap_or_default(),
                    accession_number: row.try_get("accession_number").ok(),
                    barcode: row.try_get("barcode").ok(),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Books retrieved successfully".to_string(),
                    data: Some(books),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<BookResponse>> {
                    success: false,
                    message: "Failed to retrieve books".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// GET all members
pub async fn get_members(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query("SELECT m.id::text, u.name, u.email, m.phone, m.type, m.joined_date::text FROM members m JOIN users u ON m.id = u.id")
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(rows) => {
            let members: Vec<MemberResponse> = rows
                .iter()
                .map(|row| MemberResponse {
                    id: row.get("id"),
                    name: row.get("name"),
                    email: row.get("email"),
                    phone: row.try_get("phone").ok(),
                    member_type: row.try_get("type").ok(),
                    joined_date: row.try_get("joined_date").unwrap_or_default(),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Members retrieved successfully".to_string(),
                    data: Some(members),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<MemberResponse>> {
                    success: false,
                    message: "Failed to retrieve members".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// GET all categories
pub async fn get_categories(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query("SELECT id::text, name, description FROM categories")
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(rows) => {
            let categories: Vec<CategoryResponse> = rows
                .iter()
                .map(|row| CategoryResponse {
                    id: row.get("id"),
                    name: row.get("name"),
                    description: row.try_get("description").ok(),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Categories retrieved successfully".to_string(),
                    data: Some(categories),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<CategoryResponse>> {
                    success: false,
                    message: "Failed to retrieve categories".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// GET all authors
pub async fn get_authors(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query("SELECT id::text, name, bio, nationality FROM authors")
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(rows) => {
            let authors: Vec<AuthorResponse> = rows
                .iter()
                .map(|row| AuthorResponse {
                    id: row.get("id"),
                    name: row.get("name"),
                    bio: row.try_get("bio").ok(),
                    nationality: row.try_get("nationality").ok(),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Authors retrieved successfully".to_string(),
                    data: Some(authors),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<AuthorResponse>> {
                    success: false,
                    message: "Failed to retrieve authors".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// GET all publishers
pub async fn get_publishers(State(state): State<AppState>) -> impl IntoResponse {
    let result = sqlx::query("SELECT id::text, name, address, phone, email FROM publishers")
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(rows) => {
            let publishers: Vec<PublisherResponse> = rows
                .iter()
                .map(|row| PublisherResponse {
                    id: row.get("id"),
                    name: row.get("name"),
                    address: row.try_get("address").ok(),
                    phone: row.try_get("phone").ok(),
                    email: row.try_get("email").ok(),
                })
                .collect();

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Publishers retrieved successfully".to_string(),
                    data: Some(publishers),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<Vec<PublisherResponse>> {
                    success: false,
                    message: "Failed to retrieve publishers".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Create book
pub async fn add_book(
    State(state): State<AppState>,
    Json(payload): Json<CreateBookRequest>,
) -> impl IntoResponse {
    let book_id = Uuid::new_v4().to_string();

    let result = sqlx::query(
        "INSERT INTO books (id, title, author_id, category_id, publisher_id, isbn, call_number, status, location, published_year, copies, available_copies, accession_number, barcode) 
         VALUES ($1::uuid, $2, $3::uuid, $4::uuid, $5::uuid, $6, $7, $8, $9, $10, $11, $12, $13, $14)"
    )
    .bind(book_id.clone())
    .bind(&payload.title)
    .bind(&payload.author_id)
    .bind(&payload.category_id)
    .bind(&payload.publisher_id)
    .bind(&payload.isbn)
    .bind(&payload.call_number)
    .bind(payload.status.unwrap_or_else(|| "available".to_string()))
    .bind(&payload.location)
    .bind(payload.published_year)
    .bind(payload.copies.unwrap_or(1))
    .bind(payload.available_copies.unwrap_or(1))
    .bind(&payload.accession_number)
    .bind(&payload.barcode)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse {
                success: true,
                message: "Book added successfully".to_string(),
                data: Some(book_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to add book".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// PUT - Update book
pub async fn update_book(
    State(state): State<AppState>,
    Path(book_id): Path<String>,
    Json(payload): Json<UpdateBookRequest>,
) -> impl IntoResponse {
    let result = sqlx::query(
        "UPDATE books SET
            title = COALESCE($2, title),
            author_id = COALESCE($3::uuid, author_id),
            category_id = COALESCE($4::uuid, category_id),
            publisher_id = COALESCE($5::uuid, publisher_id),
            isbn = COALESCE($6, isbn),
            call_number = COALESCE($7, call_number),
            status = COALESCE($8, status),
            location = COALESCE($9, location),
            published_year = COALESCE($10, published_year),
            copies = COALESCE($11, copies),
            available_copies = COALESCE($12, available_copies),
            accession_number = COALESCE($13, accession_number),
            barcode = COALESCE($14, barcode)
         WHERE id::text = $1",
    )
    .bind(&book_id)
    .bind(&payload.title)
    .bind(&payload.author_id)
    .bind(&payload.category_id)
    .bind(&payload.publisher_id)
    .bind(&payload.isbn)
    .bind(&payload.call_number)
    .bind(&payload.status)
    .bind(&payload.location)
    .bind(payload.published_year)
    .bind(payload.copies)
    .bind(payload.available_copies)
    .bind(&payload.accession_number)
    .bind(&payload.barcode)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Book updated successfully".to_string(),
                data: Some(book_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to update book".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// DELETE - Delete book
pub async fn delete_book(
    State(state): State<AppState>,
    Path(book_id): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM books WHERE id::text = $1")
        .bind(&book_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Book deleted successfully".to_string(),
                data: Some(book_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete book".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Create category
pub async fn add_category(
    State(state): State<AppState>,
    Json(payload): Json<CreateCategoryRequest>,
) -> impl IntoResponse {
    let category_id = Uuid::new_v4().to_string();

    let result =
        sqlx::query("INSERT INTO categories (id, name, description) VALUES ($1::uuid, $2, $3)")
            .bind(category_id.clone())
            .bind(&payload.name)
            .bind(&payload.description)
            .execute(&state.db)
            .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse {
                success: true,
                message: "Category added successfully".to_string(),
                data: Some(category_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to add category".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// PUT - Update category
pub async fn update_category(
    State(state): State<AppState>,
    Path(category_id): Path<String>,
    Json(payload): Json<UpdateCategoryRequest>,
) -> impl IntoResponse {
    let mut parts = vec![];

    if let Some(name) = &payload.name {
        parts.push(("name", name.clone()));
    }
    if let Some(description) = &payload.description {
        parts.push(("description", description.clone()));
    }

    if parts.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "No fields to update".to_string(),
                data: None,
            }),
        );
    }

    let query_str = if let Some((_, _name)) = parts.iter().find(|(k, _)| *k == "name") {
        if let Some((_, _desc)) = parts.iter().find(|(k, _)| *k == "description") {
            format!("UPDATE categories SET name = $1, description = $2 WHERE id::text = $3")
        } else {
            format!("UPDATE categories SET name = $1 WHERE id::text = $2")
        }
    } else {
        format!("UPDATE categories SET description = $1 WHERE id::text = $2")
    };

    let mut query = sqlx::query(&query_str);
    for (_key, val) in &parts {
        query = query.bind(val);
    }
    query = query.bind(&category_id);

    let result = query.execute(&state.db).await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Category updated successfully".to_string(),
                data: Some(category_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to update category".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// DELETE - Delete category
pub async fn delete_category(
    State(state): State<AppState>,
    Path(category_id): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM categories WHERE id::text = $1")
        .bind(&category_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Category deleted successfully".to_string(),
                data: Some(category_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete category".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Create author
pub async fn add_author(
    State(state): State<AppState>,
    Json(payload): Json<CreateAuthorRequest>,
) -> impl IntoResponse {
    let author_id = Uuid::new_v4().to_string();

    let result = sqlx::query(
        "INSERT INTO authors (id, name, bio, nationality) VALUES ($1::uuid, $2, $3, $4)",
    )
    .bind(author_id.clone())
    .bind(&payload.name)
    .bind(&payload.bio)
    .bind(&payload.nationality)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse {
                success: true,
                message: "Author added successfully".to_string(),
                data: Some(author_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to add author".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// PUT - Update author
pub async fn update_author(
    State(state): State<AppState>,
    Path(author_id): Path<String>,
    Json(payload): Json<UpdateAuthorRequest>,
) -> impl IntoResponse {
    let mut parts = vec![];

    if let Some(name) = &payload.name {
        parts.push(("name", name.clone()));
    }
    if let Some(bio) = &payload.bio {
        parts.push(("bio", bio.clone()));
    }
    if let Some(nationality) = &payload.nationality {
        parts.push(("nationality", nationality.clone()));
    }

    if parts.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "No fields to update".to_string(),
                data: None,
            }),
        );
    }

    let set_clause = parts
        .iter()
        .enumerate()
        .map(|(i, (k, _))| format!("{} = ${}", k, i + 1))
        .collect::<Vec<_>>()
        .join(", ");
    let query_str = format!(
        "UPDATE authors SET {} WHERE id::text = ${}",
        set_clause,
        parts.len() + 1
    );

    let mut query = sqlx::query(&query_str);
    for (_, val) in &parts {
        query = query.bind(val);
    }
    query = query.bind(&author_id);

    let result = query.execute(&state.db).await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Author updated successfully".to_string(),
                data: Some(author_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to update author".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// DELETE - Delete author
pub async fn delete_author(
    State(state): State<AppState>,
    Path(author_id): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM authors WHERE id::text = $1")
        .bind(&author_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Author deleted successfully".to_string(),
                data: Some(author_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete author".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Create publisher
pub async fn add_publisher(
    State(state): State<AppState>,
    Json(payload): Json<CreatePublisherRequest>,
) -> impl IntoResponse {
    let publisher_id = Uuid::new_v4().to_string();

    let result = sqlx::query(
        "INSERT INTO publishers (id, name, address, phone, email) VALUES ($1::uuid, $2, $3, $4, $5)"
    )
    .bind(publisher_id.clone())
    .bind(&payload.name)
    .bind(&payload.address)
    .bind(&payload.phone)
    .bind(&payload.email)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse {
                success: true,
                message: "Publisher added successfully".to_string(),
                data: Some(publisher_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to add publisher".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// PUT - Update publisher
pub async fn update_publisher(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    Json(payload): Json<UpdatePublisherRequest>,
) -> impl IntoResponse {
    let mut parts = vec![];

    if let Some(name) = &payload.name {
        parts.push(("name", name.clone()));
    }
    if let Some(address) = &payload.address {
        parts.push(("address", address.clone()));
    }
    if let Some(phone) = &payload.phone {
        parts.push(("phone", phone.clone()));
    }
    if let Some(email) = &payload.email {
        parts.push(("email", email.clone()));
    }

    if parts.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "No fields to update".to_string(),
                data: None,
            }),
        );
    }

    let set_clause = parts
        .iter()
        .enumerate()
        .map(|(i, (k, _))| format!("{} = ${}", k, i + 1))
        .collect::<Vec<_>>()
        .join(", ");
    let query_str = format!(
        "UPDATE publishers SET {} WHERE id::text = ${}",
        set_clause,
        parts.len() + 1
    );

    let mut query = sqlx::query(&query_str);
    for (_, val) in &parts {
        query = query.bind(val);
    }
    query = query.bind(&publisher_id);

    let result = query.execute(&state.db).await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Publisher updated successfully".to_string(),
                data: Some(publisher_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to update publisher".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// DELETE - Delete publisher
pub async fn delete_publisher(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM publishers WHERE id::text = $1")
        .bind(&publisher_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Publisher deleted successfully".to_string(),
                data: Some(publisher_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete publisher".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Create member
pub async fn add_member(
    State(state): State<AppState>,
    Json(payload): Json<CreateMemberRequest>,
) -> impl IntoResponse {
    let member_id = Uuid::new_v4().to_string();
    let now = Local::now().format("%Y-%m-%d").to_string();
    let name = payload.name.trim();
    let email = payload.email.trim().to_lowercase();
    let member_type = payload
        .member_type
        .as_deref()
        .unwrap_or("student")
        .trim()
        .to_lowercase();

    if name.len() < 2 || !email.contains('@') {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "Please provide a valid member name and email".to_string(),
                data: None,
            }),
        );
    }

    if !["student", "faculty", "staff"].contains(&member_type.as_str()) {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "Invalid member type".to_string(),
                data: None,
            }),
        );
    }

    let raw_password = payload
        .password
        .as_deref()
        .filter(|password| !password.is_empty())
        .map(str::to_string)
        .unwrap_or_else(|| Uuid::new_v4().to_string());

    if raw_password.len() < 6 {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "Password must be at least 6 characters".to_string(),
                data: None,
            }),
        );
    }

    let password_hash = match hash(raw_password, DEFAULT_COST) {
        Ok(hash) => hash,
        Err(err) => {
            eprintln!("Hashing error: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to create member".to_string(),
                    data: None,
                }),
            );
        }
    };

    let mut tx = match state.db.begin().await {
        Ok(tx) => tx,
        Err(err) => {
            eprintln!("Database transaction error: {}", err);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to create member".to_string(),
                    data: None,
                }),
            );
        }
    };

    let result = async {
        sqlx::query(
            "INSERT INTO users (id, name, email, password_hash, role, status)
             VALUES ($1::uuid, $2, $3, $4, 'member', 'active')",
        )
        .bind(member_id.clone())
        .bind(name)
        .bind(&email)
        .bind(&password_hash)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            "INSERT INTO members (id, phone, type, joined_date) VALUES ($1::uuid, $2, $3, $4)",
        )
        .bind(member_id.clone())
        .bind(&payload.phone)
        .bind(&member_type)
        .bind(&now)
        .execute(&mut *tx)
        .await?;

        tx.commit().await
    }
    .await;

    match result {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse {
                success: true,
                message: "Member added successfully".to_string(),
                data: Some(member_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            if err
                .as_database_error()
                .and_then(|db_err| db_err.code())
                .as_deref()
                == Some("23505")
            {
                return (
                    StatusCode::CONFLICT,
                    Json(ApiResponse::<String> {
                        success: false,
                        message: "A member or user with this email already exists".to_string(),
                        data: None,
                    }),
                );
            }

            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to add member".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// PUT - Update member
pub async fn update_member(
    State(state): State<AppState>,
    Path(member_id): Path<String>,
    Json(payload): Json<UpdateMemberRequest>,
) -> impl IntoResponse {
    let mut parts = vec![];

    if let Some(phone) = &payload.phone {
        parts.push(("phone", phone.clone()));
    }
    if let Some(member_type) = &payload.member_type {
        parts.push(("type", member_type.clone()));
    }

    if parts.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(ApiResponse::<String> {
                success: false,
                message: "No fields to update".to_string(),
                data: None,
            }),
        );
    }

    let set_clause = parts
        .iter()
        .enumerate()
        .map(|(i, (k, _))| format!("{} = ${}", k, i + 1))
        .collect::<Vec<_>>()
        .join(", ");
    let query_str = format!(
        "UPDATE members SET {} WHERE id::text = ${}",
        set_clause,
        parts.len() + 1
    );

    let mut query = sqlx::query(&query_str);
    for (_, val) in &parts {
        query = query.bind(val);
    }
    query = query.bind(&member_id);

    let result = query.execute(&state.db).await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Member updated successfully".to_string(),
                data: Some(member_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to update member".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// DELETE - Delete member
pub async fn delete_member(
    State(state): State<AppState>,
    Path(member_id): Path<String>,
) -> impl IntoResponse {
    let result = sqlx::query("DELETE FROM members WHERE id::text = $1")
        .bind(&member_id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiResponse {
                success: true,
                message: "Member deleted successfully".to_string(),
                data: Some(member_id),
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to delete member".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// Borrow and Return Structs
#[derive(Serialize, Deserialize)]
pub struct BorrowRequest {
    pub book_id: String,
    pub member_id: String,
    pub due_date: String,
}

#[derive(Serialize)]
pub struct BorrowResponse {
    pub id: String,
    pub book_id: String,
    pub member_id: String,
    pub borrow_date: String,
    pub due_date: String,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct ReturnRequest {
    pub borrow_id: String,
}

// POST - Borrow book
pub async fn borrow_book(
    State(state): State<AppState>,
    Json(payload): Json<BorrowRequest>,
) -> impl IntoResponse {
    let borrow_id = Uuid::new_v4().to_string();
    let now = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    // Start transaction
    let result = sqlx::query(
        "INSERT INTO borrows (id, book_id, member_id, borrow_date, due_date, status) 
         VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, 'borrowed')",
    )
    .bind(&borrow_id)
    .bind(&payload.book_id)
    .bind(&payload.member_id)
    .bind(&now)
    .bind(&payload.due_date)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => {
            // Update book available copies
            let _ = sqlx::query(
                "UPDATE books SET available_copies = available_copies - 1, status = 'borrowed' 
                 WHERE id::text = $1 AND available_copies > 0",
            )
            .bind(&payload.book_id)
            .execute(&state.db)
            .await;

            (
                StatusCode::CREATED,
                Json(ApiResponse {
                    success: true,
                    message: "Book borrowed successfully".to_string(),
                    data: Some(borrow_id),
                }),
            )
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to borrow book".to_string(),
                    data: None,
                }),
            )
        }
    }
}

// POST - Return book
pub async fn return_book(
    State(state): State<AppState>,
    Json(payload): Json<ReturnRequest>,
) -> impl IntoResponse {
    let now = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    // Get the borrow record
    let borrow_result =
        sqlx::query("SELECT book_id::text, due_date FROM borrows WHERE id::text = $1")
            .bind(&payload.borrow_id)
            .fetch_optional(&state.db)
            .await;

    match borrow_result {
        Ok(Some(row)) => {
            let book_id: String = row.get("book_id");
            let due_date: String = row.get("due_date");

            // Update borrow record
            let _ = sqlx::query(
                "UPDATE borrows SET return_date = $1, status = 'returned' WHERE id::text = $2",
            )
            .bind(&now)
            .bind(&payload.borrow_id)
            .execute(&state.db)
            .await;

            // Update book available copies
            let _ = sqlx::query(
                "UPDATE books SET available_copies = available_copies + 1 WHERE id::text = $1",
            )
            .bind(&book_id)
            .execute(&state.db)
            .await;

            // Check if overdue and create fine if necessary
            if now > due_date {
                let days_overdue = (chrono::DateTime::parse_from_rfc3339(&now)
                    .unwrap_or_else(|_| {
                        chrono::Local::now()
                            .with_timezone(&chrono::FixedOffset::east_opt(0).unwrap())
                    })
                    .date_naive()
                    - chrono::DateTime::parse_from_rfc3339(&due_date)
                        .unwrap_or_else(|_| {
                            chrono::Local::now()
                                .with_timezone(&chrono::FixedOffset::east_opt(0).unwrap())
                        })
                        .date_naive())
                .num_days() as f64;

                let fine_amount = days_overdue * 10.0; // 10 pesos per day

                let _ = sqlx::query(
                    "INSERT INTO fines (id, member_id, book_id, amount, reason, status, date_issued) 
                     SELECT $1::uuid, member_id, $2::uuid, $3::decimal, 'Overdue fine', 'unpaid', $4 
                     FROM borrows WHERE id::text = $5"
                )
                .bind(Uuid::new_v4().to_string())
                .bind(&book_id)
                .bind(fine_amount)
                .bind(&now)
                .bind(&payload.borrow_id)
                .execute(&state.db)
                .await;
            }

            (
                StatusCode::OK,
                Json(ApiResponse {
                    success: true,
                    message: "Book returned successfully".to_string(),
                    data: Some(payload.borrow_id),
                }),
            )
        }
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(ApiResponse::<String> {
                success: false,
                message: "Borrow record not found".to_string(),
                data: None,
            }),
        ),
        Err(err) => {
            eprintln!("Database error: {}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::<String> {
                    success: false,
                    message: "Failed to return book".to_string(),
                    data: None,
                }),
            )
        }
    }
}
