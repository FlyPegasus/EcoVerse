from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login


# resolves connectivity between flask-login and database
@login.user_loader
def load_user(id):
    return User.query.get(id)


# class User(UserMixin, db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(64))
#     email = db.Column(db.String(120), unique=True)
#     password = db.Column(db.String(128))
#     posts = db.relationship('Post', backref="author", lazy="dynamic")

#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)

#     def __repr__(self):
#         return "<User {}>".format(self.username)


# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     body = db.Column(db.String)
#     timestamp = db.Column(db.DateTime, default=datetime.now)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#     def __repr__(self):
#         return "<Post {}>".format(self.body)


# data models for database
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(150), nullable=False)
    posts = db.relationship('Post', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User {}>".format(self.username)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.String(10000))
    image = db.Column(db.LargeBinary)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    comments = db.relationship('Comment', backref='post', lazy=True)

    def __repr__(self):
        return "<Post {}>".format(self.title)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(10000))
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    postid = db.Column(db.Integer, db.ForeignKey('post.id'))
