from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def init_db(app):
	"""Initialize the SQLAlchemy extension and create all tables."""
	db.init_app(app)
	with app.app_context():
		# Import models so that SQLAlchemy is aware of them before create_all
		from . import models  # noqa: F401
		db.create_all()