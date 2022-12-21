package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SaveRequest struct {
	Ciphertext string `json:"ciphertext"`
}

var storage Storage

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
	id, err := storage.Save(ct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})

}

func retrieve_ciphertext(c *gin.Context) {
	ciphertext, err := storage.Retrieve(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ciphertext": ciphertext})
}

func view_page(c *gin.Context) {
	id := c.Param("id")
	_, err := storage.Retrieve(id)
	c.HTML(http.StatusOK, "view.html", gin.H{
		"id":     id,
		"exists": err == nil,
	})
}

func setStorage(memdb *bool) {
	if *memdb {
		log.Println("Using in-memory database")
		storage = NewInMemoryStorage()
	} else {
		log.Println("Using Firestore database")
		storage = NewFireStoreStorage()
	}
}

func main() {
	memdb := flag.Bool("memdb", false, "use in-memory database")
	flag.Parse()
	setStorage(memdb)

	router := gin.Default()
	router.StaticFile("/", "static/index.html")
	router.Static("/static", "static")

	router.LoadHTMLGlob("templates/*")
	router.GET("/:id", view_page)

	router.POST("/save", save_ciphertext)
	router.GET("/retrieve/:id", retrieve_ciphertext)

	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
