package main

import (
	"os"

	"github.com/monoxane/vxconnect/internal/config"
	"github.com/monoxane/vxconnect/internal/logging"
)

var (
	log logging.Logger
)

const (
	ERR_CONFIG_LOAD_FAILED = 1
)

func main() {
	if !config.Load() {
		os.Exit(ERR_CONFIG_LOAD_FAILED)
	}

	logging.Configure()

}
