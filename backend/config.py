import os
from dotenv import load_dotenv


class Config:
	"""Base configuration for the Flask application."""

	# Load .env from this package directory
	load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

	SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
	JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")

	# Database
	SQLALCHEMY_DATABASE_URI = os.getenv(
		"DATABASE_URL",
		"sqlite:////workspace/ecommerce.db",
	)
	SQLALCHEMY_TRACK_MODIFICATIONS = False

	# Gemini
	GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
	GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

	# CORS
	CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")