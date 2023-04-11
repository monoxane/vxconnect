package controller

import (
	"fmt"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/logging"
	"github.com/monoxane/vxconnect/internal/persistance"
)

type Controller struct {
	restPort    int
	restEngine  *gin.Engine
	persistance persistance.Store
	log         logging.Logger
}

var (
	once sync.Once
	c    *Controller
)

func New(port int, store persistance.Store) *Controller {
	once.Do(func() {
		c = &Controller{
			restEngine:  c.NewRESTServer(),
			restPort:    port,
			persistance: store,
			log:         logging.Log.With().Str("package", "controller").Logger(),
		}
	})

	return c
}

func (c *Controller) NewRESTServer() *gin.Engine {
	server := gin.New()

	api := server.Group("/api/v1")

	api.GET("/login", c.handleAuth)

	users := api.Group("/users")
	users.Use(auth.JWTMiddleware())

	users.GET("/", nil)                 // TODO HANDLE USERS
	users.GET("/me", nil)               // TODO HANDLE CURRENT USER
	users.POST("/new", nil)             // TODO HANDLE CREATING USER
	users.PATCH("/:id", nil)            // TODO HANDLE UPDATING USER
	users.DELETE("/:id", nil)           // TODO HANDLE DELETING USER
	users.POST("/id/zones", nil)        // TODO HANDLE ASSIGNING A USER A ZONE - NEEDS SUPER
	users.DELETE("/:id/zones/:id", nil) // TODO HANDLE REMOVING A USER ZONE - NEEDS SUPER

	zones := api.Group("/zones")
	zones.Use(auth.JWTMiddleware())

	zones.GET("/", nil)                       // TODO HANDLE ZONES
	zones.POST("/new", nil)                   // TODO HANDLE NEW ZONE - NEEDS SUPER
	zones.PATCH("/:id", nil)                  // TODO HANDLE UPDATING ZONE
	zones.DELETE("/:id", nil)                 // TODO HANDLE DELETING ZONE
	zones.GET("/:id/records", nil)            // TODO HANDLE GETTING ZONE RECORDS - NEEDS ZONE ADMIN
	zones.POST("/:id/records/new", nil)       // TODO HANDLE CREATING RECORD IN ZONE - NEEDS ZONE ADMIN
	zones.PATCH("/:id/records/:record", nil)  // TODO HANDLE UPDATING RECORD IN ZONE - NEEDS ZONE ADMIN
	zones.DELETE("/:id/records/:record", nil) // TODO HANDLE DELETING RECORD FROM ZONE - NEEDS ZONE ADMIN

	return server
}

func (c *Controller) Run() error {
	c.log.Info().Msg("starting REST API interface")
	if err := c.restEngine.Run(fmt.Sprintf("0.0.0.0:%d", c.restPort)); err != nil {
		return fmt.Errorf("unable to start REST API interface: %s", err)
	}

	return fmt.Errorf("REST API interface failed")
}

func (c *Controller) handleAuth(context *gin.Context) {

}
