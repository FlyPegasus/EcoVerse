from flask import Flask, request, jsonify
from ultralytics import YOLO
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load your YOLO tree model
model = YOLO("/content/drive/MyDrive/tree.pt")

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert("RGB")

    # Run model on image
    res = model(image)
    total_green_area = 0
    results = []
    masked_image_base64 = None  # Will store encoded result image

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

            circle = patches.Circle((center_x, center_y), radius, color='green', alpha=0.3)
            ax.add_patch(circle)

        percent_covered = (image_green_area / total_image_area) * 100
        total_green_area += image_green_area

        results.append({
            "green_area": round(image_green_area, 2),
            "green_coverage_percent": round(percent_covered, 2)
        })

        # Save the masked image to memory
        buf = io.BytesIO()
        plt.axis('off')
        plt.tight_layout()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        buf.seek(0)

        # Encode image to base64 string
        masked_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        buf.close()
        plt.close(fig)

    return jsonify({
        "total_green_area": round(total_green_area, 2),
        "image_results": results,
        "masked_image": masked_image_base64
    })

if __name__ == '__main__':
    app.run(debug=True)
