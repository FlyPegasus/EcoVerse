from flask import Flask, request, jsonify
from ultralytics import YOLO
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import cv2
import csv
import math
import heapq
import os
import base64
import tempfile

app = Flask(__name__)

# --- CONFIG ---
MODEL_PATH = "tree.pt"
OUTPUT_DIR = "output_images"
CIRCLE_IMG_NAME = "circle_overlay_1.png"
CSV_PATH = "nodes.csv"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Detection & Visualization ---
def detect_trees(image_path):
    model = YOLO(MODEL_PATH)
    results = model.predict(image_path)

    for r in results:
        boxes = r.boxes
        original_img = np.squeeze(r.orig_img)
        height, width = original_img.shape[:2]
        white_img = np.ones((height, width, 3), dtype=np.uint8) * 255

        fig, ax = plt.subplots()
        ax.imshow(white_img)

        xyxy = boxes.xyxy.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = boxes.cls.cpu().numpy()

        for box, score, class_id in zip(xyxy, conf, cls):
            x1, y1, x2, y2 = box
            w, h = x2 - x1, y2 - y1
            center_x, center_y = x1 + w / 2, y1 + h / 2
            radius = (w + h) / 4
            circle = patches.Circle((center_x, center_y), radius, color='green', alpha=0.3)
            ax.add_patch(circle)
            ax.text(center_x, center_y, f"{score:.2f}", fontsize=8, ha='center', va='center', color='black')

        output_path = os.path.join(OUTPUT_DIR, CIRCLE_IMG_NAME)
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
        plt.close()

    return output_path

# --- Node Extraction ---
def extract_nodes(circle_img_path):
    img = cv2.imread(circle_img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)

    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1.5, minDist=40,
                               param1=50, param2=30, minRadius=5, maxRadius=50)

    detected_nodes = []
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            detected_nodes.append((x, y, r))
            cv2.circle(img, (x, y), r, (0, 255, 0), 2)
            cv2.circle(img, (x, y), 2, (0, 0, 255), 3)
            cv2.putText(img, f'({x},{y})', (x-20, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 0, 0), 1)

    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(detected_nodes)

    return detected_nodes

# --- Pathfinding Utilities ---
def load_nodes_from_csv(csv_path):
    nodes = []
    with open(csv_path, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            x, y, r = map(float, row)
            nodes.append((x, y, r))
    return nodes

def is_inside_node(x, y, nodes):
    for nx, ny, r in nodes:
        if math.hypot(x - nx, y - ny) <= r:
            return True
    return False

def heuristic(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def get_neighbors(node, step=5):
    x, y = node
    directions = [(step, 0), (-step, 0), (0, step), (0, -step),
                  (step, step), (step, -step), (-step, step), (-step, -step)]
    return [(x + dx, y + dy) for dx, dy in directions]

def astar(start, goal, nodes, allow_through_nodes=False, grid_bounds=(0, 500, 0, 500)):
    open_set = []
    heapq.heappush(open_set, (0 + heuristic(start, goal), 0, start))
    came_from = {}
    cost_so_far = {start: 0}

    while open_set:
        _, cost, current = heapq.heappop(open_set)
        if heuristic(current, goal) < 5:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]

        for neighbor in get_neighbors(current):
            x, y = neighbor
            if not (grid_bounds[0] <= x < grid_bounds[1] and grid_bounds[2] <= y < grid_bounds[3]):
                continue
            if not allow_through_nodes and is_inside_node(x, y, nodes):
                continue
            new_cost = cost_so_far[current] + heuristic(current, neighbor)
            if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                cost_so_far[neighbor] = new_cost
                priority = new_cost + heuristic(neighbor, goal)
                heapq.heappush(open_set, (priority, new_cost, neighbor))
                came_from[neighbor] = current
    return None

# --- Path Visualization ---
def visualize_path(image_path, path, start_point, goal_point):
    img = cv2.imread(image_path)
    cv2.circle(img, start_point, 5, (255, 0, 0), -1)
    cv2.circle(img, goal_point, 5, (0, 255, 0), -1)
    for i in range(1, len(path)):
        pt1 = tuple(map(int, path[i - 1]))
        pt2 = tuple(map(int, path[i]))
        cv2.line(img, pt1, pt2, (0, 0, 255), 2)
    return img

# --- Core Flow ---
def path_finder(start, goal, image_path):
    circle_img_path = detect_trees(image_path)
    extract_nodes(circle_img_path)
    nodes = load_nodes_from_csv(CSV_PATH)

    img = cv2.imread(circle_img_path)
    height, width, _ = img.shape
    grid_bounds = (0, width, 0, height)

    path = astar(start, goal, nodes, allow_through_nodes=False, grid_bounds=grid_bounds)

    if path:
        result_img = visualize_path(circle_img_path, path, start, goal)
        return {
            "image": result_img,
            "path": path,
            "start": start,
            "goal": goal,
            "steps": len(path)
        }
    else:
        return {
            "error": "No valid path found."
        }

# --- Flask Endpoint ---
@app.route('/path', methods=['POST'])
def get_path():
    try:
        data = request.files
        start = tuple(map(int, request.form['start'].split(',')))
        goal = tuple(map(int, request.form['goal'].split(',')))
        image_file = data['image']

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            image_path = tmp.name
            image_file.save(image_path)

        result = path_finder(start, goal, image_path)

        if "error" in result:
            return jsonify(result), 400

        _, buffer = cv2.imencode('.png', result['image'])
        img_base64 = base64.b64encode(buffer).decode()

        return jsonify({
            "path": result['path'],
            "steps": result['steps'],
            "image_base64": img_base64,
            "start": result['start'],
            "goal": result['goal']
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Run Server ---
if __name__ == '__main__':
    app.run(debug=True)
