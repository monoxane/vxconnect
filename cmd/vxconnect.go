package main

import (
	"os"

	"github.com/monoxane/vxconnect/internal/config"
	"github.com/monoxane/vxconnect/internal/controller"
	"github.com/monoxane/vxconnect/internal/dns"
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

	forever := make(chan bool)

	logging.Configure()

	log = logging.Log.With().Str("package", "cmd").Logger()

	switch config.PersistenceDriver {
	case "mariadb":
	}

	store, storeError := persistence.NewMariaDBStore(config.MariaDBHost, config.MariaDBPort, config.MariaDBUsername, config.MariaDBPassword, config.DatabaseName)
	if storeError != nil {
		log.Fatal().Err(storeError).Msg("an error occured while initialising the persistence store")
	}

	migrationError := store.Migrate()
	if migrationError != nil {
		log.Fatal().Err(migrationError).Msg("an error occured while migrating the persistence store")
	}

	dnsService := dns.New()
	go dnsService.Run()

	controllerSingleton := controller.New(8080, store)
	go controllerSingleton.Run()

	<-forever
}
