from flask import Flask
# 1. adding config details
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

app = Flask(__name__)

# 2. adding config details
app.config.from_object(Config)

# 3.database instance
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# 4. Login Manager / Flask Login
login = LoginManager(app)
login.login_view = 'login_view'

# routes is imported below to avoid circular imports
from app import models, userRoutes #routes, 