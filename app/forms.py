from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, EmailField
from wtforms.validators import DataRequired, Email

# class LoginForm(FlaskForm):
#     username = StringField('Username', validators=[DataRequired()])
#     password = PasswordField('Password', validators=[DataRequired()])
#     remember_me = BooleanField('Remember Me')
#     submit = SubmitField('Sign In')


class LoginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('login')


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    email = EmailField('Email address', [DataRequired(), Email()])
    password = StringField('password', validators=[DataRequired()])
    submit = SubmitField('signup')


class PostForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])
    content = StringField('content', validators=[DataRequired()])
    submit = SubmitField('Post')
