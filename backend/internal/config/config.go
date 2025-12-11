package config

import (
	"os"
	"strings"
)

type Config struct {
	AppEnv     string
	AppName    string
	AppPort    string
	AppHost    string
	
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	
	JWTSecret           string
	JWTExpiration       string
	JWTRefreshSecret    string
	JWTRefreshExpiration string
	
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	SMTPFromEmail string
	SMTPFromName  string
	
	SMSProvider   string
	SMSAccountSID string
	SMSAuthToken  string
	SMSFromNumber string
	
	QRISMerchantID   string
	QRISMerchantName string
	QRISAPIKey       string
	QRISAPISecret    string
	QRISEnvironment  string
	
	CORSAllowedOrigins []string
	
	LogLevel  string
	LogFormat string
}

func Load() *Config {
	return &Config{
		AppEnv:     getEnv("APP_ENV", "development"),
		AppName:    getEnv("APP_NAME", "MyApp"),
		AppPort:    getEnv("APP_PORT", "8080"),
		AppHost:    getEnv("APP_HOST", "0.0.0.0"),
		
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "myapp_dev"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),
		
		JWTSecret:           getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiration:       getEnv("JWT_EXPIRATION", "24h"),
		JWTRefreshSecret:    getEnv("JWT_REFRESH_SECRET", "your-refresh-secret"),
		JWTRefreshExpiration: getEnv("JWT_REFRESH_EXPIRATION", "168h"),
		
		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFromEmail: getEnv("SMTP_FROM_EMAIL", "noreply@example.com"),
		SMTPFromName:  getEnv("SMTP_FROM_NAME", "MyApp"),
		
		SMSProvider:   getEnv("SMS_PROVIDER", "twilio"),
		SMSAccountSID: getEnv("SMS_ACCOUNT_SID", ""),
		SMSAuthToken:  getEnv("SMS_AUTH_TOKEN", ""),
		SMSFromNumber: getEnv("SMS_FROM_NUMBER", ""),
		
		QRISMerchantID:   getEnv("QRIS_MERCHANT_ID", ""),
		QRISMerchantName: getEnv("QRIS_MERCHANT_NAME", ""),
		QRISAPIKey:       getEnv("QRIS_API_KEY", ""),
		QRISAPISecret:    getEnv("QRIS_API_SECRET", ""),
		QRISEnvironment:  getEnv("QRIS_ENVIRONMENT", "sandbox"),
		
		CORSAllowedOrigins: strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000"), ","),
		
		LogLevel:  getEnv("LOG_LEVEL", "info"),
		LogFormat: getEnv("LOG_FORMAT", "json"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
