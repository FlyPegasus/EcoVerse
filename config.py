import os

# __file__: path to current file
basedir = os.path.abspath(os.path.dirname(__file__))

# inherit from built-in base class object


class Config(object):
    # CSRF configurations
    SECRET_KEY = os.environ.get('SECRET_KEY') or "catch-me-if-you-can"

    UPLOAD_FOLDER = 'uploads/'
    PROCESSED_FOLDER = 'processed/'
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

    # SQL configurations
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # tracks some kind of object changes
