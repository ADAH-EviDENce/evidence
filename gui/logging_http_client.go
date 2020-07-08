package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
)

// HTTP client that logs all requests.
var loggingClient = http.Client{
	Transport: functionRoundTripper(loggingTransport),
}

func loggingTransport(r *http.Request) (*http.Response, error) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("cannot read Body from HTTP request: %v", err)
		return nil, err
	}
	log.Printf("HTTP %s request to %s with body %q",
		r.Method, r.URL, body)
	r.Body = ioutil.NopCloser(bytes.NewReader(body))
	return http.DefaultTransport.RoundTrip(r)
}

type functionRoundTripper func(*http.Request) (*http.Response, error)

func (f functionRoundTripper) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
