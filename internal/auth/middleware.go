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
	currentUserRoles, err := CurrentUserRoles(context)
	if err != nil {
		return false
	}

	for _, currentUserRole := range currentUserRoles {
		if currentUserRole == role {
			return true
		}
	}

	return false
}
