package main

import (
	"encoding/base64"
	"errors"
	"math/rand"
	"time"
)

type Storage interface {
	// Save stores the ciphertext and returns the ID.
	Save(record string) (id string, err error)
	// Retrieve retrieves the ciphertext by ID.
	Retrieve(id string) (ciphertext string, err error)
}

type InMemoryStorage struct {
	records map[string]string
}

func NewInMemoryStorage() *InMemoryStorage {
	return &InMemoryStorage{
		records: make(map[string]string),
	}
}

func generateId() string {
	b := make([]byte, 16)
	rand.Seed(time.Now().UnixNano())
	rand.Read(b)
	encoding := base64.URLEncoding.WithPadding(base64.NoPadding)
	return encoding.EncodeToString(b)
}

func (s *InMemoryStorage) findId() string {
	for {
		id := generateId()
		if _, ok := s.records[id]; !ok {
			return id
		}
	}
}

func (s *InMemoryStorage) Save(ciphertext string) (id string, err error) {
	id = s.findId()
	s.records[id] = ciphertext
	return id, nil
}

func (s *InMemoryStorage) Retrieve(id string) (ciphertext string, err error) {
	record, ok := s.records[id]
	if !ok {
		return "", errors.New("record not found")
	}
	return record, nil
}
