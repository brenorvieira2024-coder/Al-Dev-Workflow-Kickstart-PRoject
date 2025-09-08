from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .database import init_db
from .routes import api_bp


def create_app() -> Flask:
	"""Create and configure the Flask application."""
	app = Flask(__name__)
	app.config.from_object(Config)

	# Extensions
	CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})
	JWTManager(app)
	init_db(app)

	# Blueprints
	app.register_blueprint(api_bp)

	@app.get("/health")
	def health():
		return jsonify({"status": "ok"}), 200

	return app


if __name__ == "__main__":
	app = create_app()
	app.run(host="0.0.0.0", port=5000, debug=True)