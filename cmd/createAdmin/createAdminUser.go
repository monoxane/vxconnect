package main

import (
	"os"

	"github.com/google/uuid"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/config"
	"github.com/monoxane/vxconnect/internal/controller"
	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/logging"
	"github.com/monoxane/vxconnect/internal/persistance"
)

const (
	ERR_CONFIG_LOAD_FAILED = 1
)

var (
	log logging.Logger
)

func main() {
	if !config.Load() {
		os.Exit(ERR_CONFIG_LOAD_FAILED)
	}

	logging.Configure()

	log = logging.Log.With().Str("package", "cmd").Logger()

	switch config.PersistanceDriver {
	case "mariadb":
	}

	store, storeError := persistance.NewMariaDBStore(config.MariaDBHost, config.MariaDBPort, config.MariaDBUsername, config.MariaDBPassword, config.DatabaseName)
	if storeError != nil {
		log.Fatal().Err(storeError).Msg("an error occured while initialising the persistance store")
	}

	migrateErr := store.Migrate()
	if migrateErr != nil {
		log.Error().Err(migrateErr).Msg("unable to migrate persistance store")
	}

	log.Printf("args %+v", os.Args)

	hash, hashErr := auth.HashPassword(os.Args[2])
	if hashErr != nil {
		log.Error().Err(hashErr).Msg("unable to hash user password")
	}

	user := &entity.User{
		Id:           uuid.NewString(),
		Username:     os.Args[1],
		PasswordHash: hash,
		Role:         controller.ROLE_ADMIN,
		Zones:        []string{},
	}

	storeErr := store.CreateUser(user)
	if storeErr != nil {
		log.Error().Err(hashErr).Msg("unable to create user")
	}
}
