package main

import (
	"errors"
)

type InMemoryStorage struct {
	records map[string]string
}

func NewInMemoryStorage() *InMemoryStorage {
	return &InMemoryStorage{
		records: make(map[string]string),
	}
}

func (s *InMemoryStorage) findId() string {
	for {
		id := GenerateId()
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
