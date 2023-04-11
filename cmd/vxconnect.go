package main

import (
	"os"

	"github.com/monoxane/vxconnect/internal/config"
	"github.com/monoxane/vxconnect/internal/controller"
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

	store, err := persistance.NewMariaDBStore(config.MariaDBHost, config.MariaDBPort, config.MariaDBUsername, config.MariaDBPassword, config.DatabaseName)
	if err != nil {
		log.Fatal().Err(err).Msg("an error occured while initialising the persistance store")
	}

	c := controller.New(8080, store)

	if err := c.Run(); err != nil {
		log.Fatal().Err(err).Msg("an error occurred when initialising controller")
	}
}
