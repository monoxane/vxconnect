package main

import (
	"os"

	"github.com/google/uuid"
	"github.com/monoxane/vxconnect/internal/auth"
	"github.com/monoxane/vxconnect/internal/config"
	"github.com/monoxane/vxconnect/internal/controller"
	"github.com/monoxane/vxconnect/internal/entity"
	"github.com/monoxane/vxconnect/internal/logging"
	"github.com/monoxane/vxconnect/internal/persistence"
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

	switch config.PersistenceDriver {
	case "mariadb":
	}

	store, storeError := persistence.NewMariaDBStore(config.MariaDBHost, config.MariaDBPort, config.MariaDBUsername, config.MariaDBPassword, config.DatabaseName)
	if storeError != nil {
		log.Fatal().Err(storeError).Msg("an error occured while initialising the persistence store")
	}

	migrateErr := store.Migrate()
	if migrateErr != nil {
		log.Error().Err(migrateErr).Msg("unable to migrate persistence store")
	}

	log.Printf("args %+v", os.Args)

	hash, hashErr := auth.HashPassword(os.Args[2])
	if hashErr != nil {
		log.Error().Err(hashErr).Msg("unable to hash user password")
	}

	user := &entity.User{
		ID:           uuid.NewString(),
		Username:     os.Args[1],
		PasswordHash: hash,
		Roles:        []string{controller.ROLE_ADMIN},
		Zones:        []string{},
	}

	storeErr := store.CreateUser(user)
	if storeErr != nil {
		log.Error().Err(hashErr).Msg("unable to create user")
	}
}
