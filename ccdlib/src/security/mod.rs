use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,   // User ID
    pub email: String, // User email
    pub role: String,  // User role
    pub exp: u64,      // Expiration time (unix timestamp)
    pub iat: u64,      // Issued at (unix timestamp)
}

impl Claims {
    pub fn new(user_id: String, email: String, role: String, hours: u64) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let exp = now + (hours * 3600);

        Self {
            sub: user_id,
            email,
            role,
            exp,
            iat: now,
        }
    }
}

pub fn create_jwt(claims: &Claims, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let key = EncodingKey::from_secret(secret.as_bytes());
    encode(&Header::default(), claims, &key)
}

pub fn verify_jwt(token: &str, secret: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let key = DecodingKey::from_secret(secret.as_bytes());
    let token_data = decode::<Claims>(token, &key, &Validation::default())?;
    Ok(token_data.claims)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_jwt_creation_and_verification() {
        let secret = "test_secret_key";
        let claims = Claims::new(
            "user123".to_string(),
            "user@example.com".to_string(),
            "member".to_string(),
            24,
        );

        let token = create_jwt(&claims, secret).expect("Failed to create JWT");
        let verified_claims = verify_jwt(&token, secret).expect("Failed to verify JWT");

        assert_eq!(verified_claims.sub, claims.sub);
        assert_eq!(verified_claims.email, claims.email);
        assert_eq!(verified_claims.role, claims.role);
    }
}
