from app import app
from flask import Flask, render_template, request, url_for, flash, redirect, Response
from flask_login import current_user, login_required, login_user, logout_user
from app.forms import LoginForm, SignUpForm, PostForm
from app.models import User, Post
import os
import cv2
import plastic_detector
from werkzeug.urls import url_parse
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from app import db
from utils.garbage_analyser import garbage_analyser


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/image/<int:image_id>')
def serve_image(image_id):
    image = Post.query.get(image_id)
    if image:
        # Adjust mimetype if needed
        return Response(image.image, mimetype='image/jpeg')
    else:
        return "Image not found", 404


@app.route('/analysed_image/<int:image_id>')
def serve_analysed_image(image_id):
    image = Post.query.get(image_id)
    if image:
        # Adjust mimetype if needed
        return Response(image.analysed_img, mimetype='image/jpeg')
    else:
        return "Image not found", 404


@app.route('/image/<img_path>')
def serve_plastic_img(img_path):
    img = cv2.imread(img_path)
    # mimetype = ['image/jpeg', 'image/jpg', 'image/png']
    return Response(img, mimetype='image/jpg;image/png;image/jpeg')


@app.route('/')
@app.route('/dashboard')
def dashboard():
    all_posts = Post.query.order_by(desc(Post.pollution_percent)).all()
    all_users = User.query.all()
    return render_template('dashboard.html', posts=all_posts, users=all_users)
    # return render_template('dashboard.html')


# blog views
@app.route('/post', methods=['GET', 'POST'])
@login_required
def post_view():
    form = PostForm()
    if form.validate_on_submit():
        p_post = Post()
        p_post.title = form.title.data
        p_post.content = form.content.data
        p_post.image = form.image.data.read()
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        p_post.location = latitude + longitude  # location code needs changes
        p_post.pollution_percent, p_post.analysed_img = garbage_analyser(
            p_post.image)  # pollution percentage
        p_post.userid = current_user.id  # Link the blog post to the current user
        db.session.add(p_post)
        db.session.commit()
        flash('New post added!', 'success')
        posts = current_user.posts
        # return redirect(url_for('post_view'))
        return render_template('post.html', posts=posts, form=form)
    posts = current_user.posts
    return render_template('post.html', posts=posts, form=form)

# register and login views


@app.route('/register', methods=['GET', 'POST'])
def register_view():
    form = SignUpForm()
    if form.validate_on_submit():
        username = form.username.data
        email = form.email.data
        password = form.password.data
        user = User.query.filter_by(username=username).first()
        if user:
            flash('Username already exists.')
            return redirect(url_for('register'))
        new_user = User(username=username, email=email)
        new_user.set_password(password=password)
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! Please log in.')
        return redirect(url_for('login_view'))

    return render_template('register.html', form=form, title="register")


@app.route('/login', methods=['GET', 'POST'])
def login_view():
    if current_user.is_authenticated:  # exception for already logged in user
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            # try render_template("login.html")
            return redirect(url_for('login_view'))
        login_user(user, remember=form.remember_me.data)
        # for protection against hackers who replace malicious urls in the next argument
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('dashboard')
        # redirects to either next page or home page
        # return redirect(url_for(next_page))
        return redirect(url_for('dashboard'))
    return render_template("login.html", form=form)


@app.route('/logout')
def logout_view():
    logout_user()
    # return redirect(url_for('home_view'))
    return redirect(url_for('dashboard'))


# All models


@app.route("/models")
def model_home_view():
    return render_template("home.html", title="models")


@app.route("/plastic", methods=['GET', 'POST'])
def plastic_view():
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']

        # If the user does not select a file, browser may submit an empty file part
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = file.filename
            # print(filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            flash('File successfully uploaded')
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image = plastic_detector.transform(file_path)
            cv2.imwrite(os.path.join(
                app.config['PROCESSED_FOLDER'], 'detected_' + filename), image)
            img_path = os.path.abspath(os.path.join(
                app.config['PROCESSED_FOLDER'], 'detected_' + filename))
            print(img_path)
            return render_template("plastic_detected.html", image_path=img_path)
        else:
            flash('File not supported!')
    return render_template("plastic.html", title="plastic")
