from app import app
from app.models import User, Post
from sqlalchemy import desc
from flask import jsonify


@app.route('/')
@app.route('/home')
def get_dashboard_data():
    all_posts = Post.query.order_by(desc(Post.pollution_percent)).all()
    all_users = User.query.all()

    # Prepare the data to be returned as JSON
    posts_data = []
    for post in all_posts:
        posts_data.append({
            'id': post.id,
            'title': post.title,
            'pollution_percent': post.pollution_percent,
            # Add other relevant post attributes here
        })

    users_data = []
    for user in all_users:
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Add other relevant user attributes here
        })

    return jsonify({'posts': posts_data, 'users': users_data})
