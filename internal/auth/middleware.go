package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := ValidateToken(c)

		if err != nil {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}

		c.Next()
	}
}

func HasRole(context *gin.Context, role string) bool {
	currentUserRole, err := CurrentUserRole(context)
	if err != nil {
		return false
	}

	if currentUserRole == role {
		return true
	}

	return false
}
