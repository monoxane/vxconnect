package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/logging"
	"github.com/monoxane/vxconnect/internal/persistance"
	"github.com/monoxane/vxconnect/internal/utilities"
)

type Controller struct {
	restPort    int
	restEngine  *gin.Engine
	persistance persistance.Store
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

func New(port int, store persistance.Store) *Controller {
	c := &Controller{
		restEngine:  NewRESTServer(),
		restPort:    port,
		persistance: store,
		log:         logging.Log.With().Str("package", "controller").Logger(),
	}

	controller = c

	return controller
}

func NewRESTServer() *gin.Engine {
	server := gin.New()
	server.Use(logging.GinLogger())

	api := server.Group("/api/v1")

	api.GET("/login", handleAuth)

	users := api.Group("/users")
	users.Use(auth.JWTMiddleware())

	users.GET("/", handleUsers)                    // TODO HANDLE USERS
	users.GET("/me", NotImplemented)               // TODO HANDLE CURRENT USER
	users.POST("/new", NotImplemented)             // TODO HANDLE CREATING USER
	users.PATCH("/:id", NotImplemented)            // TODO HANDLE UPDATING USER
	users.DELETE("/:id", NotImplemented)           // TODO HANDLE DELETING USER
	users.POST("/id/zones", NotImplemented)        // TODO HANDLE ASSIGNING A USER A ZONE - NEEDS ADMIN
	users.DELETE("/:id/zones/:id", NotImplemented) // TODO HANDLE REMOVING A USER ZONE - NEEDS ADMIN

	zones := api.Group("/zones")
	zones.Use(auth.JWTMiddleware())

	zones.GET("/", NotImplemented)                       // TODO HANDLE ZONES
	zones.POST("/new", NotImplemented)                   // TODO HANDLE NEW ZONE - NEEDS SUPER
	zones.PATCH("/:id", NotImplemented)                  // TODO HANDLE UPDATING ZONE
	zones.DELETE("/:id", NotImplemented)                 // TODO HANDLE DELETING ZONE
	zones.GET("/:id/records", NotImplemented)            // TODO HANDLE GETTING ZONE RECORDS - NEEDS OPERATOR
	zones.POST("/:id/records/new", NotImplemented)       // TODO HANDLE CREATING RECORD IN ZONE - NEEDS OPERATOR
	zones.PATCH("/:id/records/:record", NotImplemented)  // TODO HANDLE UPDATING RECORD IN ZONE - NEEDS OPERATOR
	zones.DELETE("/:id/records/:record", NotImplemented) // TODO HANDLE DELETING RECORD FROM ZONE - NEEDS OPERATOR

	return server
}

func NotImplemented(c *gin.Context) {
	c.String(http.StatusNotImplemented, "Not Implemented Yet")
}

func (c *Controller) Run() error {
	c.log.Info().Msg("starting REST API interface")
	if err := c.restEngine.Run(fmt.Sprintf("0.0.0.0:%d", c.restPort)); err != nil {
		return fmt.Errorf("unable to start REST API interface: %s", err)
	}

	return fmt.Errorf("REST API interface failed")
}

func handleAuth(context *gin.Context) {
	controller.HandleAuth(context)
}

func (controller *Controller) HandleAuth(context *gin.Context) {
	payload := &entity.LoginBody{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid body", bindErr)
		return
	}

	dbUser, userErr := controller.persistance.GetUserByUsername(payload.Username)
	if userErr != nil {
		utilities.RESTError(context, http.StatusUnauthorized, "user not found", userErr)
		return
	}

	valid := auth.ValidatePassword(dbUser.PasswordHash, payload.Password)
	if !valid {
		utilities.RESTError(context, http.StatusUnauthorized, "invalid password", nil)
		return
	}

	token, tokenErr := auth.GenerateToken(dbUser.Username, dbUser.Role)
	if tokenErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to generate token", tokenErr)
		return
	}

	resp := entity.LoginResponse{
		Username: dbUser.Username,
		Token:    token,
		Zones:    dbUser.Zones,
		Role:     dbUser.Role,
	}

	context.JSON(http.StatusOK, resp)
}

func handleUsers(context *gin.Context) {
	controller.HandleUsers(context)
}

func (controller *Controller) HandleUsers(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	users, usersErr := controller.persistance.GetUsers()
	if usersErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to get users", usersErr)
		return
	}

	context.JSON(http.StatusOK, entity.RESTResult{
		Results:      users,
		TotalResults: len(users),
	})
}
