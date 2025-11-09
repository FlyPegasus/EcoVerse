import cv2
import csv
import math
import heapq
import random

from matplotlib import pyplot as plt

# ----- Load Nodes -----
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

# ----- Heuristic and Neighbors -----
def heuristic(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def get_neighbors(node, step=5):
    x, y = node
    directions = [(step, 0), (-step, 0), (0, step), (0, -step),
                  (step, step), (step, -step), (-step, step), (-step, -step)]
    return [(x + dx, y + dy) for dx, dy in directions]

# ----- A* Algorithm -----
def astar(start, goal, nodes, allow_through_nodes=False, grid_bounds=(0, 500, 0, 500)):
    open_set = []
    heapq.heappush(open_set, (0 + heuristic(start, goal), 0, start))
    came_from = {}
    cost_so_far = {start: 0}

    while open_set:
        _, cost, current = heapq.heappop(open_set)

        if heuristic(current, goal) < 5:  # Close enough
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

# ----- Get All Safe Goal Points -----
def get_all_safe_goals(image_path, nodes, step=10):
    img = cv2.imread(image_path)
    height, width, _ = img.shape

    safe_points = []
    for y in range(0, height, step):
        for x in range(0, width, step):
            if not is_inside_node(x, y, nodes):
                safe_points.append((x, y))
    return safe_points, (0, width, 0, height)

# ----- Run Dijkstra-style A* on All Safe Goals -----
def run_all_paths(start, image_path, csv_path, allow_through_nodes=False):
    nodes = load_nodes_from_csv(csv_path)
    safe_goals, grid_bounds = get_all_safe_goals(image_path, nodes, step=10)

    successful_paths = []
    for goal in safe_goals:
        path = astar(start, goal, nodes, allow_through_nodes, grid_bounds)
        if path:
            successful_paths.append((goal, path))

    print(f"Found {len(successful_paths)} valid paths from start point {start}.")
    return successful_paths

# Example usage:
image_path = r"E:\Project\Final Year\Ecoverse backend (NodeJs)\flask microservice\output_images\circle_overlay.png"
csv_path = r"E:\Project\Final Year\Ecoverse backend (NodeJs)\flask microservice\nodes.csv"
start = (50, 50)

paths = run_all_paths(start, image_path, csv_path, allow_through_nodes=False)

# Print or process the shortest path
if paths:
    shortest = min(paths, key=lambda x: len(x[1]))
    print(f"Shortest path found to goal {shortest[0]} with {len(shortest[1])} steps.")
else:
    print("No valid paths found.")

def visualize_paths_on_image(image_path, paths, start_point):
    img = cv2.imread(image_path)

    # Draw the start point
    cv2.circle(img, start_point, 5, (255, 0, 0), -1)  # Blue

    for goal, path in paths:
        color = tuple(random.randint(0, 255) for _ in range(3))  # Random color
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
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB for matplotlib
    return img

# Call this after finding paths
visualize_paths_on_image(image_path, paths, start)

