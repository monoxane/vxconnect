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

func handleZones(context *gin.Context) {
	controller.HandleZones(context)
}

func (controller *Controller) HandleZones(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	zones, zonesErr := controller.persistance.GetZones()
	if zonesErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to get zones", zonesErr)
		return
	}

	context.JSON(http.StatusOK, entity.RESTResult{
		Results:      zones,
		TotalResults: len(zones),
	})
}

func handleNewZone(context *gin.Context) {
	controller.HandleNewZone(context)
}

func (controller *Controller) HandleNewZone(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	payload := &entity.Zone{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	payload.ID = uuid.NewString()

	storeErr := controller.persistance.CreateZone(payload)
	if errors.Is(storeErr, gorm.ErrDuplicatedKey) {
		utilities.RESTError(context, http.StatusConflict, "zone alerady exists", storeErr)
		return
	}

	if storeErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store zone", storeErr)
		return
	}
}

func handleDeleteZone(context *gin.Context) {
	controller.HandleDeleteZone(context)
}

func (controller *Controller) HandleDeleteZone(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	id := context.Param("id")

	deleteErr := controller.persistance.DeleteZone(id)
	if errors.Is(deleteErr, gorm.ErrRecordNotFound) {
		utilities.RESTError(context, http.StatusBadRequest, "zone does not exist", nil)
		return
	}

	if deleteErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "unable to delete zone", deleteErr)
		return
	}

}
