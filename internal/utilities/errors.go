package utilities

import (
	"github.com/gin-gonic/gin"
	"github.com/monoxane/vxconnect/internal/entity"
)

func RESTError(context *gin.Context, code int, message string, err error) {
	if err != nil {
		context.JSON(code, entity.RESTError{
			StatusCode: code,
			Message:    message,
			Error:      err.Error(),
		})
	} else {
		context.JSON(code, entity.RESTError{
			StatusCode: code,
			Message:    message,
		})
	}
}
