package main

import (
	"encoding/base64"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var DB = make(map[string]string)

func generate_id() string {
	b := make([]byte, 16)
	rand.Seed(time.Now().UnixNano())
	rand.Read(b)
	encoding := base64.URLEncoding.WithPadding(base64.NoPadding)
	return encoding.EncodeToString(b)
}

func find_id() string {
	for {
		id := generate_id()
		if _, ok := DB[id]; !ok {
			return id
		}
	}
}

func make_retrieve_url(id string) string {
	return "http://localhost:8080/retrieve/" + id
}

type SaveRequest struct {
	Ciphertext string `json:"ciphertext"`
}

func save_ciphertext(c *gin.Context) {
	var req SaveRequest
	c.BindJSON(&req)
	ct := req.Ciphertext

	if ct == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "ciphertext is empty",
		})
		return
	}
	id := find_id()
	DB[id] = ct
	c.JSON(http.StatusOK, gin.H{
		"url": make_retrieve_url(id),
	})
}

func retrieve_ciphertext(c *gin.Context) {

	ciphertext, ok := DB[c.Param("id")]
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{
			"err": "not found",
		})
		return
	}
	//c.JSON(http.StatusOK, gin.H{
	//	"ciphertext": ciphertext,
	//})
	c.HTML(http.StatusOK, "retrieve.html", gin.H{"ciphertext": ciphertext})

	//c.HTML(http.StatusOK, "retrieve.html", gin.H{"ciphertext": ciphertext})
}

func main() {
	router := gin.Default()
	router.StaticFile("/", "static/index.html")
	router.Static("/static", "static")
	router.LoadHTMLGlob("templates/*")

	router.POST("/save", save_ciphertext)
	router.GET("/retrieve/:id", retrieve_ciphertext)
	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}