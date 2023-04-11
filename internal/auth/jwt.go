package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/monoxane/vxconnect/internal/config"
)

func GenerateToken(username, role string) (string, error) {
	claims := jwt.MapClaims{}
	claims["username"] = username
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(token_lifespan)).Unix()
	claims["issuer"] = issuer

	// Actually generate the Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(config.JWTSecret))
}

// Validate if the JWT token is valid, is from this issuer, and is signed with the approriate secret
// Will return an error if anything is off with the token
func ValidateToken(c *gin.Context) error {
	// Extract the token from the Gin Context
	tokenString := ExtractToken(c)

	// Parse the token with the JWT library
	// I Don't know how this does things I just read the docs to implement it
	_, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.JWTSecret), nil
	})

	// If theres an error its not valid
	if err != nil {
		return err
	}

	return nil
}

// Extract the JWT Token from the Gin Context
func ExtractToken(c *gin.Context) string {
	// From either the query parameter used in WebSockets for some unholy reason
	token := c.Query("token")
	if token != "" {
		return token
	}

	// Or the Authorization header used in conventional HTTP requests
	bearerToken := c.Request.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}

	// Oh no, there's no token, the client should feel bad and go away
	return ""
}

// Extract the current user from the token
func CurrentUser(c *gin.Context) (string, error) {
	// Extract the token from context
	tokenString := ExtractToken(c)

	// Parse it
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.JWTSecret), nil
	})

	if err != nil {
		return "", err
	}

	// Read the claims map
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		// And return the username
		return claims["username"].(string), nil
	}

	return "", nil
}

func CurrentUserRole(c *gin.Context) (string, error) {
	tokenString := ExtractToken(c)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.JWTSecret), nil
	})

	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		return claims["role"].(string), nil
	}

	return "", nil
}
