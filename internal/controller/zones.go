package controller

import (
	"errors"
	"fmt"
	"net/http"
	"time"

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

func handleZone(context *gin.Context) {
	controller.HandleZone(context)
}

func (controller *Controller) HandleZone(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) && !auth.HasRole(context, auth.ROLE_ZONE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	id := context.Param("zone")

	zone, zoneErr := controller.persistance.GetZoneByID(id)
	if errors.Is(zoneErr, gorm.ErrRecordNotFound) {
		utilities.RESTError(context, http.StatusNotFound, "zone not found", zoneErr)
		return
	}

	context.JSON(http.StatusOK, entity.RESTResult{
		Results:      []*entity.Zone{zone},
		TotalResults: 1,
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

	id := context.Param("zone")

	deleteRecErr := controller.persistance.DeleteZoneRecords(id)
	if deleteRecErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "an error occured while deleting zone records", nil)
		return
	}

	deleteErr := controller.persistance.DeleteZone(id)
	if errors.Is(deleteErr, gorm.ErrRecordNotFound) {
		utilities.RESTError(context, http.StatusBadRequest, "zone does not exist", nil)
		return
	}

	if deleteErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to delete zone", deleteErr)
		return
	}
}

func (controller *Controller) updateZoneSOA(id string) error {
	zone, zoneErr := controller.persistance.GetZoneByID(id)
	if zoneErr != nil {
		return fmt.Errorf("unable to get zone while updating SOA: %s", zoneErr)
	}

	zone.UpdatedAt = int(time.Now().UnixNano())

	updateErr := controller.persistance.SaveZone(zone)
	if updateErr != nil {
		return fmt.Errorf("unable to save zone while updating SOA: %s", updateErr)
	}

	return nil
}

func handleZoneRecords(context *gin.Context) {
	controller.handleZoneRecords(context)
}

func (controller *Controller) handleZoneRecords(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) && !auth.HasRole(context, auth.ROLE_ZONE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	zone := context.Param("zone")

	records, recordErr := controller.persistance.GetZoneRecords(zone)
	if recordErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to get zone records", recordErr)
		return
	}

	context.JSON(http.StatusOK, entity.RESTResult{
		Results:      records,
		TotalResults: len(records),
	})
}

func handleNewZoneRecord(context *gin.Context) {
	controller.HandleNewZoneRecord(context)
}

func (controller *Controller) HandleNewZoneRecord(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) && !auth.HasRole(context, auth.ROLE_ZONE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	payload := &entity.Record{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	zone := context.Param("zone")

	payload.ID = uuid.NewString()
	payload.ZoneID = zone

	storeErr := controller.persistance.CreateRecord(payload)
	if errors.Is(storeErr, gorm.ErrDuplicatedKey) {
		utilities.RESTError(context, http.StatusConflict, "zone record alerady exists", storeErr)
		return
	}

	if storeErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store zone record", storeErr)
		return
	}

	soaErr := controller.updateZoneSOA(zone)
	if soaErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store update zone soa", soaErr)
		return
	}
}

func handleUpdateZoneRecord(context *gin.Context) {
	controller.HandleUpdateZoneRecord(context)
}

func (controller *Controller) HandleUpdateZoneRecord(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) && !auth.HasRole(context, auth.ROLE_ZONE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	payload := &entity.Record{}
	bindErr := context.BindJSON(payload)
	if bindErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	if payload.TTL == 0 || payload.Target == "" {
		utilities.RESTError(context, http.StatusBadRequest, "invalid request body", bindErr)
		return
	}

	zone := context.Param("zone")
	id := context.Param("id")

	record, recordErr := controller.persistance.GetRecordByID(id)
	if recordErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "record does not exist", recordErr)
		return
	}

	record.TTL = payload.TTL
	record.Target = payload.Target

	storeErr := controller.persistance.SaveRecord(record)
	if errors.Is(storeErr, gorm.ErrDuplicatedKey) {
		utilities.RESTError(context, http.StatusConflict, "zone record alerady exists", storeErr)
		return
	}

	if storeErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store zone record", storeErr)
		return
	}

	soaErr := controller.updateZoneSOA(zone)
	if soaErr != nil {
		utilities.RESTError(context, http.StatusInternalServerError, "unable to store update zone soa", soaErr)
		return
	}
}

func handleDeleteZoneRecord(context *gin.Context) {
	controller.HandleDeleteZoneRecord(context)
}

func (controller *Controller) HandleDeleteZoneRecord(context *gin.Context) {
	if !auth.HasRole(context, auth.ROLE_ADMIN) && !auth.HasRole(context, auth.ROLE_ZONE_ADMIN) {
		utilities.RESTError(context, http.StatusUnauthorized, "user does not have permission to access this resource", nil)
		return
	}

	id := context.Param("id")

	deleteErr := controller.persistance.DeleteRecord(id)
	if errors.Is(deleteErr, gorm.ErrRecordNotFound) {
		utilities.RESTError(context, http.StatusBadRequest, "record does not exist", nil)
		return
	}

	if deleteErr != nil {
		utilities.RESTError(context, http.StatusBadRequest, "unable to delete record", deleteErr)
		return
	}
}
