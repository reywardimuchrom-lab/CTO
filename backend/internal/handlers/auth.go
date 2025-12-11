package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user": gin.H{
			"email": req.Email,
			"name":  req.Name,
		},
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": "sample-jwt-token",
		"refresh_token": "sample-refresh-token",
	})
}

func RefreshToken(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"token": "new-sample-jwt-token",
	})
}

func GetProfile(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"id":    1,
		"email": "user@example.com",
		"name":  "Sample User",
	})
}
