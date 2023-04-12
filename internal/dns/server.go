package dns

import (
	"net"
	"strings"

	"github.com/miekg/dns"
	"github.com/monoxane/vxconnect/internal/controller"
	"github.com/monoxane/vxconnect/internal/logging"
)

var (
	server *Server
)

type Server struct {
	service *dns.Server
	log     logging.Logger
}

func New() *Server {
	server = &Server{
		service: &dns.Server{Addr: ":53", Net: "udp"},
		log:     logging.Log.With().Str("package", "dns").Logger(),
	}

	dns.HandleFunc(".", handleRequest)

	return server
}

func (server *Server) Run() {
	go func() {
		err := server.service.ListenAndServe()
		if err != nil {
			server.log.Fatal().Err(err).Msg("unable to start DNS service")
		}
	}()
}

func handleRequest(w dns.ResponseWriter, r *dns.Msg) {
	server.HandleRequest(w, r)
}

func (server *Server) HandleRequest(w dns.ResponseWriter, r *dns.Msg) {
	m := new(dns.Msg)
	m.SetReply(r)

	name := strings.TrimSuffix(r.Question[0].Name, ".")

	record := controller.QueryRecord(name)
	if record != nil {
		hdr := dns.RR_Header{Name: r.Question[0].Name, Rrtype: dns.TypeA, Class: dns.ClassINET, Ttl: uint32(record.TTL)}
		switch record.Type {
		case "CNAME":
			m.Answer = []dns.RR{&dns.CNAME{Hdr: hdr, Target: record.Target}}
		case "A":
			ip := net.ParseIP(record.Target)
			m.Answer = []dns.RR{&dns.A{Hdr: hdr, A: ip}}
		}
		server.log.Debug().Str("name", name).Interface("record", record).Msg("serving record")
	}

	err := w.WriteMsg(m)
	if err != nil {
		server.log.Error().Err(err).Msg("unable to write dns answer")
	}
}
