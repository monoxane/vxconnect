package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/utilities"
	"gorm.io/gorm"
)

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

	dbUser, userErr := controller.persistence.GetUserByUsername(payload.Username)
	if userErr != nil {
		utilities.RESTError(context, http.StatusUnauthorized, "user not found", userErr)
		return
	}

	valid := auth.ValidatePassword(dbUser.PasswordHash, payload.Password)
	if !valid {
		utilities.RESTError(context, http.StatusUnauthorized, "invalid password", nil)
		return
	}

	token, tokenErr := auth.GenerateToken(dbUser.Username, dbUser.Roles)
	if tokenErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to generate token", tokenErr)
		return
	}

	resp := entity.LoginResponse{
		Username: dbUser.Username,
		Token:    token,
		Zones:    dbUser.Zones,
		Roles:    dbUser.Roles,
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

	users, usersErr := controller.persistence.GetUsers()
	if usersErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to get users", usersErr)
		return
	}

	context.JSON(http.StatusOK, entity.RESTResult{
		Results:      users,
		TotalResults: len(users),
	})
}

func handleNewUser(context *gin.Context) {
	controller.HandleNewUser(context)
}

func (controller *Controller) HandleNewUser(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	payload := &entity.NewUserBody{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	// if payload.Role != auth.ROLE_ADMIN && payload.Role != auth.ROLE_ZONE_ADMIN {
	// 	utilities.RESTError(context, http.StatusBadRequest, "invalid role", nil)
	// 	return
	// }

	hash, hashErr := auth.HashPassword(payload.Password)
	if hashErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to hash password", hashErr)
		return
	}

	if payload.Zones == nil {
		payload.Zones = []string{}
	}

	user := &entity.User{
		ID:           uuid.NewString(),
		Username:     payload.Username,
		PasswordHash: hash,
		Roles:        payload.Roles,
		Zones:        payload.Zones,
	}

	storeErr := controller.persistence.CreateUser(user)
	if errors.Is(storeErr, gorm.ErrDuplicatedKey) {
		utilities.RESTError(context, http.StatusConflict, "username in use", storeErr)
		return
	}

	if storeErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store user", storeErr)
		return
	}
}

func handleUpdateUser(context *gin.Context) {
	controller.HandleUpdateUser(context)
}

func (controller *Controller) HandleUpdateUser(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	id := context.Param("id")

	payload := &entity.User{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	user, userErr := controller.persistence.GetUserById(id)
	if userErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "user does not exist", userErr)
		return
	}

	user.Zones = payload.Zones

	storeErr := controller.persistence.SaveUser(user)
	if storeErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store user", storeErr)
		return
	}
}

func handleDeleteUser(context *gin.Context) {
	controller.HandleDeleteUser(context)
}

func (controller *Controller) HandleDeleteUser(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	id := context.Param("id")

	deleteErr := controller.persistence.DeleteUser(id)
	if errors.Is(deleteErr, gorm.ErrRecordNotFound) {
		utilities.RESTError(context, http.StatusBadRequest, "user does not exist", nil)
		return
	}

	if deleteErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "unable to delete user", deleteErr)
		return
	}

}
