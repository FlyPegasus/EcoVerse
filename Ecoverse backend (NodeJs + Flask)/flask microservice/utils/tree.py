from io import BytesIO
import numpy as np
import matplotlib.pyplot as plt
from skimage import io
import cv2
import heapq
import math
from utils.cloudinary import cloudinary
from PIL import Image
import os
import numpy as np
import matplotlib.pyplot as plt
from skimage import io
import cv2


class ImageSeg:
    # Initializing the path of image and threshold value by taking as class parameters
    def __init__(self, path):
        self.path = path
        self.img = plt.imread(path)
        self.threshold = 0
    # Visualize the raw rgb image

    def visualize_rgb(self):
        rgb_img = self.img
        plt.imshow(rgb_img)

    # Nullify the R and B values in the image matrix
    def RGNull(self):
        arr = np.array(self.img)
        greenval = 0
        count = 0
        for i in range(len(arr)):
            for j in range(len(arr[i])):
                count += 1
                greenval += arr[i][j][1]
                arr[i][j][0] = 0
                arr[i][j][2] = 0
        self.threshold = (greenval/count)/1.5
        return arr

    # Grayscale the image
    def IsoGray(self):
        RGNull_img = self.RGNull()
        gray_img = cv2.cvtColor(RGNull_img, cv2.COLOR_RGB2GRAY)
        return gray_img

    # Apply Thresholding
    def IsoGrayThresh(self):

        gray_img = self.IsoGray()
        for i in range(len(gray_img)):
            for j in range(len(gray_img[i])):
                if gray_img[i][j] > self.threshold:
                    gray_img[i][j] = 255
                else:
                    gray_img[i][j] = 0

        # plt.imshow(gray_img)
        return gray_img

    # Comparison b/w raw rgb, grayscaled and thresholded images
    # def visualize_compare(self):
    #     fig = plt.figure(figsize=(14, 30))
    #     row = 1
    #     cols = 3
    #     fig.add_subplot(row, cols, 1)
    #     io.imshow(self.img)
    #     fig.add_subplot(row, cols, 2)
    #     io.imshow(self.IsoGray())
    #     fig.add_subplot(row, cols, 3)
    #     io.imshow(self.IsoGrayThresh())

    # Function to count the tree pixels in the thresholded image
    def PixelCount(self):
        count = 0
        arr = self.IsoGrayThresh()
        for i in arr:
            for j in i:
                if j != 0:
                    count += 1

        return count


class OptimalPathing:
    def __init__(self, img, PATH):
        self.img = img
        self.PATH = PATH

    def Precompute_EuclideanDist(self, img):
        rows, cols = len(img), len(img[0])
        AdjMat = np.zeros((rows, cols))
        for i in range(rows):
            for j in range(cols):
                AdjMat[i][j] = math.sqrt((i - (rows-1))**2 + (j - (cols-1))**2)

            return AdjMat

    def create_graph(self, binary_image, target):
        binary_image = np.array(binary_image)
        graph = {}
        rows, cols = len(binary_image), len(binary_image[0])

        TreeCount_Density = 115/(rows*cols)*1000     # Confidence_Val
        TCD_FACTOR = math.exp(TreeCount_Density*100)
        AdjMat = self.Precompute_EuclideanDist(binary_image)
        for i in range(rows):
            print('Creating graph for pixel:', i)
            for j in range(cols):
                neighbors = []
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        if dx == 0 and dy == 0:
                            continue
                        ni, nj = i + dx, j + dy
                        euclid_dist = math.sqrt(
                            (ni - (target[0]))**2 + (nj - (target[1]))**2)
                        avg_density = 0
                        for fact in range(1, 11):
                            try:
                                alpha_val = (
                                    255-binary_image[ni-fact*dx][nj+fact*dy])
                            except:
                                pass
                            try:
                                beta_val = (
                                    255-binary_image[ni+fact*dx][nj-fact*dy])
                            except:
                                pass

                            avg_density += alpha_val + beta_val

                        avg_density /= 20  # Average density over the 20 pixels

                        if 0 <= ni < rows and 0 <= nj < cols:
                            neighbors.append(((ni, nj), TCD_FACTOR*(255 - binary_image[ni][nj]) +
                                              euclid_dist**2 + 50000*np.log(avg_density+1)))

                        # Store the neighbors for the current pixel
                        graph[(i, j)] = neighbors
        return graph

    def trace_path(self, parents, start, target):
        path = []
        current = target
        while current != start:
            path.append(current)
            current = parents[current]
        path.append(start)
        path.reverse()
        return path

    def ComputeDjikstra(self, start_pixel=(0, 0), target_pixel=(200, 600)):
        print('creating graph')
        graph = self.create_graph(self.img, target_pixel)
        # Find the shortest path
        parents = {}
        heap = [(0, start_pixel)]
        visited = set()

        while heap:
            print('Dijkstra running')
            (cost, current) = heapq.heappop(heap)

            if current in visited:
                continue

            visited.add(current)

            if current == target_pixel:
                break

            for neighbor, weight in graph[current]:
                if neighbor not in visited:
                    parents[neighbor] = current
                    heapq.heappush(heap, (cost + weight, neighbor))
        print('Dijkstra completed')
        shortest_path = self.trace_path(parents, start_pixel, target_pixel)
        # return shortest_path

        # Visualize the image and the shortest path
        def save_result_to_cloudinary(img, shortest_path, original_img_path):
            # Convert shortest_path into coordinates
            x_coords, y_coords = zip(*shortest_path)

            # Load original image
            original_image = plt.imread(original_img_path)

            # Create a single plot (subplot 2 only)
            fig, ax = plt.subplots(figsize=(14, 15))
            ax.imshow(original_image)
            ax.plot(y_coords, x_coords, color='red', linewidth=2)

            # Save plot to memory buffer
            buf = BytesIO()
            plt.savefig(buf, format='png')
            plt.close(fig)
            buf.seek(0)
            print('Image saved to buffer')

            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                buf, folder="path_images/")
            return upload_result['secure_url']
        return shortest_path, save_result_to_cloudinary(self.img, shortest_path, self.PATH)


def path_finder(start, goal, image_path):
    start = (int(start[0]), int(start[1]))
    goal = (int(goal[0]), int(goal[1]))
    PATH = convert_to_png(image_path)
    print('started')

    # Create ImageSeg object and thresholded image
    seg_obj = ImageSeg(PATH)
    print('ImageSeg object created')
    img = seg_obj.IsoGrayThresh()

    # Calculate green coverage
    green_pixels = seg_obj.PixelCount()
    total_pixels = img.shape[0] * img.shape[1]
    green_coverage = green_pixels / total_pixels

    # Create OptimalPathing object and compute shortest path
    path_obj = OptimalPathing(img, PATH)
    print('OptimalPathing object created')
    # shortest_path = path_obj.ComputeDjikstra(start_pixel=start, target_pixel=goal)
    shortest_path, image_url = path_obj.ComputeDjikstra(
        start_pixel=start, target_pixel=goal)

    # Compute total path length in pixels
    def compute_path_length(path):
        dist = 0
        for i in range(1, len(path)):
            x1, y1 = path[i - 1]
            x2, y2 = path[i]
            dist += math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        return dist

    # For returning proper structured data:
    path_length = compute_path_length(shortest_path)

    return {
        "green_coverage": round(green_coverage, 4),
        "total_path_length_px": round(path_length, 2),
        "path_image_url": image_url  # already a URL
    }


def convert_to_png(input_path, output_path=None):
    # Load the image
    img = Image.open(input_path)

    # Remove the extension from original filename
    base_name = os.path.splitext(os.path.basename(input_path))[0]

    # Set output path
    if output_path is None:
        output_path = os.path.join(
            os.path.dirname(input_path), base_name + ".png")

    # Convert and save as PNG
    img.convert("RGBA").save(output_path, "PNG")
    return output_path
