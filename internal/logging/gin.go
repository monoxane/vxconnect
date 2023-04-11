package logging

import "github.com/gin-gonic/gin"

func GinLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		switch c.Writer.Status() {
		case 404:
			Log.Warn().
				Str("method", c.Request.Method).
				Str("path", c.Request.URL.Path).
				Int("status", c.Writer.Status()).
				Str("remote", c.ClientIP()).
				Str("user-agent", c.Request.UserAgent()).
				Msg("")
		case 500:
			Log.Error().
				Str("method", c.Request.Method).
				Str("path", c.Request.URL.Path).
				Int("status", c.Writer.Status()).
				Str("remote", c.ClientIP()).
				Strs("errors", c.Errors.Errors()).
				Str("user-agent", c.Request.UserAgent()).
				Msg("")
		default:
			Log.Info().
				Str("method", c.Request.Method).
				Str("path", c.Request.URL.Path).
				Int("status", c.Writer.Status()).
				Str("remote", c.ClientIP()).
				Str("user-agent", c.Request.UserAgent()).
				Msg("")
		}
	}
}
