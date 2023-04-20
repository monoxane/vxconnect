package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/logging"
	"github.com/monoxane/vxconnect/internal/persistence"
)

type Controller struct {
	restPort    int
	restEngine  *gin.Engine
	persistence persistence.Store
	log         logging.Logger
}

const (
	ROLE_ADMIN    = "ADMIN"
	ROLE_OPERATOR = "OPERATOR"
	ROLE_VIEWER   = "VIEWER"
)

var (
	controller *Controller
)

func New(port int, store persistence.Store) *Controller {
	c := &Controller{
		restEngine:  NewRESTServer(),
		restPort:    port,
		persistence: store,
		log:         logging.Log.With().Str("package", "controller").Logger(),
	}

	controller = c

	return controller
}

func NewRESTServer() *gin.Engine {
	server := gin.New()
	server.Use(logging.GinLogger())

	api := server.Group("/api/v1")

	api.POST("/login", handleAuth)

	users := api.Group("/users")
	users.Use(auth.JWTMiddleware())

	users.GET("", handleUsers)
	users.GET("/me", NotImplemented) // TODO HANDLE CURRENT USER
	users.POST("/new", handleNewUser)
	users.PATCH("/:id", handleUpdateUser)
	users.DELETE("/:id", handleDeleteUser)
	users.POST("/:id/zones", NotImplemented)         // TODO HANDLE ASSIGNING A USER A ZONE - NEEDS ADMIN
	users.DELETE("/:id/zones/:zone", NotImplemented) // TODO HANDLE REMOVING A USER ZONE - NEEDS ADMIN

	zones := api.Group("/zones")
	zones.Use(auth.JWTMiddleware())

	zones.GET("", handleZones)
	zones.GET("/:zone", handleZone)
	zones.POST("/new", handleNewZone)
	zones.DELETE("/:zone", handleDeleteZone)
	zones.GET("/:zone/records", handleZoneRecords)
	zones.POST("/:zone/records/new", handleNewZoneRecord)
	zones.PATCH("/:zone/records/:id", handleUpdateZoneRecord)
	zones.DELETE("/:zone/records/:id", handleDeleteZoneRecord)

	return server
}

func NotImplemented(c *gin.Context) {
	c.String(http.StatusNotImplemented, "Not Implemented Yet")
}

func (c *Controller) Run() {
	go func() {
		c.log.Info().Msg("starting REST API interface")
		if err := c.restEngine.Run(fmt.Sprintf("0.0.0.0:%d", c.restPort)); err != nil {
			c.log.Fatal().Err(err).Msg("unable to start Controller")
		}

		c.log.Fatal().Msg("the Controller exited")
	}()
}

func QueryRecord(name string) *entity.Record { return controller.QueryRecord(name) }
func (c *Controller) QueryRecord(name string) *entity.Record {
	record, _ := c.persistence.GetRecordbyName(name)
	return record
}
