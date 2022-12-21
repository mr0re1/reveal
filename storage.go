package main

import (
	"encoding/base64"
	"math/rand"
	"time"
)

type Storage interface {
	// Save stores the ciphertext and returns the ID.
	Save(record string) (id string, err error)
	// Retrieve retrieves the ciphertext by ID.
	Retrieve(id string) (ciphertext string, err error)
}

func GenerateId() string {
	b := make([]byte, 16)
	rand.Seed(time.Now().UnixNano())
	rand.Read(b)
	encoding := base64.URLEncoding.WithPadding(base64.NoPadding)
	return encoding.EncodeToString(b)
}
