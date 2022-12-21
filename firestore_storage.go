package main

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type FireStoreStorage struct {
	client     *firestore.Client
	collection *firestore.CollectionRef
}

func NewFireStoreStorage() *FireStoreStorage {
	client, err := firestore.NewClient(context.TODO(), firestore.DetectProjectID)
	if err != nil {
		log.Fatalf("Failed to create firestore client: %v", err)
	}
	collection := client.Collection("reveal_ciphertexts")
	return &FireStoreStorage{client, collection}
}

func (s *FireStoreStorage) findId() string {
	for {
		id := GenerateId()
		_, err := s.Retrieve(id)
		if err != nil {
			return id
		}
	}
}

func (s *FireStoreStorage) Save(ciphertext string) (id string, err error) {
	id = s.findId()
	_, err = s.collection.Doc(id).Create(context.TODO(), map[string]string{
		"ciphertext": ciphertext,
	})
	return
}

func (s *FireStoreStorage) Retrieve(id string) (ciphertext string, err error) {
	rec, err := s.collection.Doc(id).Get(context.TODO())
	if err != nil {
		if status.Code(err) != codes.NotFound {
			log.Fatalf("Failed to get record: %v", err)
		}
		return "", err

	}
	return rec.Data()["ciphertext"].(string), nil
}
