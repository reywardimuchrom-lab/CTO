package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/myorg/myapp/internal/config"
	"github.com/myorg/myapp/internal/handlers"
	"github.com/myorg/myapp/internal/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := config.Load()

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	router.Use(middleware.CORS(cfg.CORSAllowedOrigins))
	router.Use(middleware.Logger())

	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", handlers.HealthCheck)
		v1.GET("/ping", handlers.Ping)

		auth := v1.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.POST("/refresh", handlers.RefreshToken)
		}

		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			protected.GET("/profile", handlers.GetProfile)
		}
	}

	addr := fmt.Sprintf("%s:%s", cfg.AppHost, cfg.AppPort)
	log.Printf("Starting server on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
