package rest

import "github.com/gin-gonic/gin"

func GetRESTServer() *gin.Engine {
	server := gin.New()

	api := server.Group("/api/v1")

	api.GET("auth", nil)

	return server
}
