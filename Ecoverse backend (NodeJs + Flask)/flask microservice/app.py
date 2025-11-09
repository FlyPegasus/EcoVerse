import base64
import io
from flask import Flask, request, jsonify
from utils.cloudinary import cloudinary
from utils.garbage_analyser import garbage_analyser
from utils.cloudinary import analysed_image_url
from utils.tree import path_finder
from flask_cors import CORS
import os
import cv2
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])


@app.route('/analyse', methods=['POST'])
def analyse_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file'].read()
    pollution_percent, analysed_img = garbage_analyser(
        file)  # pollution percentage
    return jsonify({
        'score': pollution_percent,
        'analysed_img': analysed_image_url(analysed_img)
    }), 200


@app.route('/tree_analyse', methods=['POST'])
def tree_analyse():
    if 'file' not in request.files:
        # return jsonify({'error': 'No file part in the request'}), 400
        return jsonify({
            'message': 'No file part in the request',
            'success': False,
            'error': 'path_not_found'
        }), 400
    file = request.files['file']  # .read()
    # filename = file.filename
    # Get coordinates from form data
    try:
        start_x = float(request.form.get('start_x', 0))
        start_y = float(request.form.get('start_y', 0))
        goal_x = float(request.form.get('goal_x', 0))
        goal_y = float(request.form.get('goal_y', 0))
    except ValueError:
        # return jsonify({'error': 'Invalid coordinate values'}), 400
        return jsonify({
            'message': 'Invalid coordinate values',
            'success': False,
            'error': 'path_not_found'
        }), 400
    upload_folder = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    img_path = os.path.join(os.path.join(
        os.getcwd(), 'uploads'), 'tree_analysed.jpg')
    file.save(img_path)
    start = (start_x, start_y)  # Starting point
    goal = (goal_x, goal_y)  # User-specified goal point

    # Call the path finding function
    # output_img, green_area_data, all_paths, steps = path_finder(
    #     start, goal, img_path)
    x = path_finder(
        start, goal, img_path)
    output_img = x['path_image_url']  # Get the path image URL
    if isinstance(output_img, str) and output_img != "No valid path found.":
        return jsonify({
            # 'path': upload_result1["secure_url"],
            'path': output_img,  # Directly returning the image path
            # 'all_paths': upload_result2["secure_url"],
            # Total green area percentage
            'total_green_area': x['green_coverage'],
            # Total path length in pixels
            'total_steps': x['total_path_length_px'],
            'message': 'Path analysis completed successfully',
            'success': True,
        }), 200
    elif isinstance(output_img, str) and output_img == "No valid path found.":
        return jsonify({
            'message': 'No valid path could be found in the provided image.',
            'success': False,
            'error': 'path_not_found'
        }), 404  # Using 404 Not Found as a semantic status code
    else:
        # # Convert BGR to RGB for PIL
        # output_img = cv2.cvtColor(output_img, cv2.COLOR_BGR2RGB)
        # pil_img = Image.fromarray(output_img)

        # # Save to buffer and encode
        # buf = io.BytesIO()
        # pil_img.save(buf, format='JPEG')
        # img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        # Convert BGR to RGB
        # output_img = cv2.cvtColor(output_img, cv2.COLOR_BGR2RGB)
        # pil_img1 = Image.fromarray(output_img)

        # # Save to buffer
        # buffer = io.BytesIO()
        # pil_img1.save(buffer, format='JPEG')
        # buffer.seek(0)

        # # Upload to Cloudinary
        # upload_result1 = cloudinary.uploader.upload(
        #     buffer, folder="eco_path_results")

        # all paths to be uploaded
        # all_paths_buffer = io.BytesIO()
        # pil_img2 = Image.fromarray(all_paths)
        # pil_img2.save(all_paths_buffer, format='JPEG')
        # all_paths_buffer.seek(0)
        # upload_result2 = cloudinary.uploader.upload(
        #     all_paths_buffer, folder="eco_path_results", public_id="all_paths")
        return jsonify({
            # 'path': upload_result1["secure_url"],
            'path': output_img,  # Directly returning the image path
            # 'all_paths': upload_result2["secure_url"],
            # Total green area percentage
            'total_green_area': x['green_coverage'],
            # Total path length in pixels
            'total_steps': x['total_path_length_px'],
            'message': 'Path analysis completed successfully',
            'success': True,
        }), 200


if __name__ == '__main__':
    app.run(debug=True)
