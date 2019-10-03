// Client for doc2vec service.

package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/knaw-huc/evidence-gui/internal/vectors"
)

type d2vClient struct {
	baseUrl string
}

func (c *d2vClient) vector(text string) (v vectors.Vector, err error) {
	u := c.baseUrl + "/infer_vector"
	textJson, err := json.Marshal(struct {
		Text string `json:"text"`
	}{text})
	if err != nil {
		return
	}

	r, err := http.NewRequest("POST", u, bytes.NewReader(textJson))
	if err != nil {
		return
	}

	r.Header.Add("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(r)
	if err != nil {
		return
	}

	return parseVectorResponse(resp.Body)
}

func parseVectorResponse(r io.Reader) (v vectors.Vector, err error) {
	var res struct {
		Loaded  bool      `json:"model_loaded"`
		Present bool      `json:"model_present"`
		Vector  []float32 `json:"vector"`
	}
	err = json.NewDecoder(r).Decode(&res)
	switch {
	case err != nil:
	case !res.Loaded:
		err = errors.New("model not loaded")
	case !res.Present:
		err = errors.New("model not present")
	}
	if err != nil {
		return
	}
	v = vectors.Vector(res.Vector)
	return
}
