import random
from ultralytics import YOLO
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os
import cv2
import csv
import math
import heapq
import json


def path_finder(start, goal, img_path):
    model = YOLO(r"C:\Users\anshu\Downloads\treem.pt")  # load model
    res = model.predict(img_path)  # loading image

    # calculate green area
    total_green_area = 0
    results = []
    for r in res:
        boxes = r.boxes
        img = np.squeeze(r.plot())  # Image with YOLO boxes
        img_height, img_width = img.shape[:2]
        total_image_area = img_width * img_height

        xyxy = boxes.xyxy.cpu().numpy()

        image_green_area = 0
        fig, ax = plt.subplots()
        ax.imshow(img)

        for box in xyxy:
            x1, y1, x2, y2 = box
            w, h = x2 - x1, y2 - y1
            center_x, center_y = x1 + w / 2, y1 + h / 2
            radius = (w + h) / 4
            area = np.pi * (radius ** 2)
            image_green_area += area

            circle = patches.Circle(
                (center_x, center_y), radius, color='green', alpha=0.3)
            ax.add_patch(circle)

        percent_covered = (image_green_area / total_image_area) * 100
        total_green_area += image_green_area

        results.append({
            "green_area": round(image_green_area, 2),
            "green_coverage_percent": round(percent_covered, 2)
        })
    green_area_data = {
        "total_green_area": round(total_green_area, 2),
        "image_results": results
    }
    # end of green area calculation

    # node creation
    # Output directory
    output_dir = "output_images"
    os.makedirs(output_dir, exist_ok=True)

    for idx, r in enumerate(res):
        boxes = r.boxes

        # Get the original image shape
        original_img = np.squeeze(r.orig_img)  # Shape: (H, W, C)
        height, width = original_img.shape[:2]

        # Create a new white image (same size)
        white_img = np.ones((height, width, 3), dtype=np.uint8) * 255

        # Plot on the white image
        fig, ax = plt.subplots()
        ax.imshow(white_img)

        # Get bounding box info
        xyxy = boxes.xyxy.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = boxes.cls.cpu().numpy()

        for box, score, class_id in zip(xyxy, conf, cls):
            x1, y1, x2, y2 = box
            w = x2 - x1
            h = y2 - y1
            center_x = x1 + w / 2
            center_y = y1 + h / 2
            radius = (w + h) / 4

            # Add green transparent circle
            circle = patches.Circle(
                (center_x, center_y), radius, color='green', alpha=0.3)
            ax.add_patch(circle)

            # Confidence label
            ax.text(center_x, center_y, f"{score:.2f}",
                    fontsize=8, ha='center', va='center', color='black')

        # ax.axis('off')
        # ax.set_title("Tree Density Circles on White Background")

        # Save the image
        output_path = os.path.join(output_dir, f"circle_overlay.png")
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0)

    # ******************************************************************************************************************************

    # apply hough circle
    # Load image
    image_path = 'output_images/circle_overlay.png'  # Replace with your actual path
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)

    # Detect circles using Hough Transform
    circles = cv2.HoughCircles(
        gray,
        cv2.HOUGH_GRADIENT, dp=1.5, minDist=40,  # dp is defualt 1.4
        param1=50, param2=30, minRadius=5, maxRadius=50
    )

    # Convert circle data and draw them
    detected_nodes = []
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")

        for (x, y, r) in circles:
            detected_nodes.append((x, y, r))
            cv2.circle(img, (x, y), r, (0, 255, 0), 2)        # Circle outline
            cv2.circle(img, (x, y), 2, (0, 0, 255), 3)        # Circle center
            cv2.putText(img, f'({x},{y})', (x-20, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 0, 0), 1)

    # Save to CSV
    csv_path = 'nodes.csv'  # create csv  file to update
    with open(csv_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(detected_nodes)

    print(f"Saved {len(detected_nodes)} nodes to '{csv_path}'.")

    # # Show the result
    # plt.figure(figsize=(10, 10))
    # plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    # plt.title('Detected Nodes')
    # plt.axis('off')
    # plt.show()
    # start A*
    # --- Load Obstacle Nodes ---
    def load_nodes_from_csv(csv_path):
        nodes = []
        with open(csv_path, 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                x, y, r = map(float, row)
                nodes.append((x, y, r))
        return nodes

    # --- Check If Point Inside Any Node (Obstacle) ---
    def is_inside_node(x, y, nodes, margin=2):
        for nx, ny, r in nodes:
            if math.hypot(x - nx, y - ny) <= r - margin:
                return True
        return False

    # --- Heuristic Function ---

    def heuristic(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1])

    # --- Get Neighbors for 8 Directions Movement ---
    def get_neighbors(node, step=2):  # reduced from 5 or 10
        x, y = node
        directions = [(step, 0), (-step, 0), (0, step), (0, -step),
                      (step, step), (step, -step), (-step, step), (-step, -step)]
        return [(x + dx, y + dy) for dx, dy in directions]

    # --- A* Pathfinding Algorithm ---

    def astar(start, goal, nodes, allow_through_nodes=False, grid_bounds=(0, 500, 0, 500)):
        if not allow_through_nodes:
            if is_inside_node(*start, nodes):
                print("Start point is inside a node.")
                return None
            if is_inside_node(*goal, nodes):
                print("Goal point is inside a node.")
                return None

        open_set = []
        heapq.heappush(open_set, (0 + heuristic(start, goal), 0, start))
        came_from = {}
        cost_so_far = {start: 0}

        while open_set:
            _, cost, current = heapq.heappop(open_set)

            if heuristic(current, goal) <= 3:  # <= step size
                path = []
                while current in came_from:
                    path.append(current)
                    current = came_from[current]
                path.append(start)
                return path[::-1]

            # match with get_neighbors
            for neighbor in get_neighbors(current, step=2):
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

    # --- Visualize Path ---

    def visualize_path(image_path, path, start_point, goal_point):
        img = cv2.imread(image_path)
        # cv2.circle(img, start_point, 5, (255, 0, 0), -1)  # Start - Blue
        # cv2.circle(img, goal_point, 5, (0, 255, 0), -1)   # Goal - Green
        cv2.circle(img, (int(start_point[0]), int(
            start_point[1])), 5, (0, 255, 0), -1)

        cv2.circle(img, (int(goal_point[0]), int(
            goal_point[1])), 5, (0, 255, 0), -1)

        for i in range(1, len(path)):
            pt1 = tuple(map(int, path[i - 1]))
            pt2 = tuple(map(int, path[i]))
            cv2.line(img, pt1, pt2, (0, 0, 255), 2)  # Path - Red
        return img

    # All Possible Paths
    def get_all_safe_goals(image_path, nodes, step=10):
        img = cv2.imread(image_path)
        height, width, _ = img.shape

        safe_points = []
        for y in range(0, height, step):
            for x in range(0, width, step):
                if not is_inside_node(x, y, nodes):
                    print('safe point found', x, y)
                    safe_points.append((x, y))
        return safe_points, (0, width, 0, height)

    # ----- Run Dijkstra-style A* on All Safe Goals -----
    def run_all_paths(start, image_path, csv_path, allow_through_nodes=False):
        nodes = load_nodes_from_csv(csv_path)
        safe_goals, grid_bounds = get_all_safe_goals(
            image_path, nodes, step=10)

        successful_paths = []
        for goal in safe_goals:
            path = astar(start, goal, nodes, allow_through_nodes, grid_bounds)
            if path:
                successful_paths.append((goal, path))

        print(
            f"Found {len(successful_paths)} valid paths from start point {start}.")
        return successful_paths

    # Example usage:
    # image_path = r"E:\Project\Final Year\Ecoverse backend (NodeJs)\flask microservice\output_images\circle_overlay.png"
    # csv_path = r"E:\Project\Final Year\Ecoverse backend (NodeJs)\flask microservice\nodes.csv"
    # start = (50, 50)

    paths = run_all_paths(start, image_path, csv_path,
                          allow_through_nodes=False)

    # Print or process the shortest path
    steps = 0
    if paths:
        shortest = min(paths, key=lambda x: len(x[1]))
        steps = len(shortest[1])
        print(
            f"Shortest path found to goal {shortest[0]} with {steps} steps.")
    else:
        print("No valid paths found.")

    def visualize_paths_on_image(image_path, paths, start_point):
        img = cv2.imread(image_path)

        # Draw the start point
        cv2.circle(img, (int(start_point[0]), int(
            start_point[1])), 5, (255, 0, 0), -1)  # Blue

        for goal, path in paths:
            color = tuple(random.randint(0, 255)
                          for _ in range(3))  # Random color
            for i in range(1, len(path)):
                pt1 = tuple(map(int, path[i - 1]))
                pt2 = tuple(map(int, path[i]))
                cv2.line(img, pt1, pt2, color, 1)
            # Draw goal point
            img = cv2.circle(img, tuple(map(int, goal)), 3, color, -1)

        # Show with matplotlib
        # plt.figure(figsize=(12, 12))
        # plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        # plt.title("All Valid Paths from Start")
        # plt.axis("off")
        # plt.show()
        # Convert to RGB for matplotlib
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return img

    # Call this after finding paths
    all_paths = visualize_paths_on_image(image_path, paths, start)

    # --- Main Execution ---
    image_path = 'output_images/circle_overlay.png'
    csv_path = 'nodes.csv'
    #   start = (0, 0)
    #   goal = (360, 390)  # <-- User-specified goal

    nodes = load_nodes_from_csv(csv_path)
    img = cv2.imread(image_path)
    height, width, _ = img.shape
    grid_bounds = (0, width, 0, height)

    path = astar(start, goal, nodes, allow_through_nodes=False,
                 grid_bounds=grid_bounds)

    if path:
        print(f"Path found with {len(path)} steps. {path}")
        return visualize_path(image_path, path, start, goal), green_area_data, all_paths, steps
    else:
        print(f"No valid path found. {path}")
        return "No valid path found.", green_area_data, all_paths, steps
###################################################################################################################
#
#            #calcualte all safe nodes
#
#
#
###################################################################################################################


#   def load_nodes_from_csv(csv_path):
#       nodes = []
#       with open(csv_path, 'r') as file:
#           reader = csv.reader(file)
#           for row in reader:
#               x, y, r = map(float, row)
#               nodes.append((x, y, r))
#       return nodes

#   def is_inside_node(x, y, nodes):
#       for nx, ny, r in nodes:
#           if math.hypot(x - nx, y - ny) <= r:
#               return True
#       return False

#   def get_all_safe_goals(img_path, csv_path, step=10):
#       # Load image and get size
#       img = cv2.imread(img_path)
#       height, width, _ = img.shape

#       # Load obstacle nodes
#       nodes = load_nodes_from_csv(csv_path)

#       # Find all safe pixels (not inside any node)
#       safe_points = []
#       for y in range(0, height, step):
#           for x in range(0, width, step):
#               if not is_inside_node(x, y, nodes):
#                   safe_points.append((x, y))

#       return safe_points


# #   #
# #   # Example usage
# #   image_path = '/content/output_images/circle_overlay_1.png'
# #   csv_path = 'nodes.csv'

# #   safe_goals = get_all_safe_goals(image_path, csv_path, step=10)
# #   print(f"Total safe goal points: {len(safe_goals)}")
# #   print("First 20 safe points:")
# #   for point in safe_goals[:]:
# #       print(point)
# img_path = r"C:\Users\anshu\Pictures\tree2.jpg"
img_path = r"C:\Users\anshu\Pictures\tree.jpg"
start = (0, 0)  # Starting point
goal = (360, 390)  # User-specified goal point
# path_finder(start, goal, img_path)  # Call the path finding function
