import numpy as np
from ultralytics import YOLO
import cv2
from io import BytesIO


def garbage_analyser(file):
    in_memory_file = BytesIO(file)

    # Convert the byte stream to a NumPy array
    img_array = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)

    # Decode the image using OpenCV
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    model = YOLO("E:\Project\Final Year\EcoVerse\garbage_yolov8-seg.pt")
    pred_img = model.predict(img, device='cpu')
    success, encoded_image = cv2.imencode('.png', img)
    byte_io = BytesIO(encoded_image.tobytes())
    percentage_coverage = 0
    for results in pred_img:
        if results.masks is not None:
            # Convert the PyTorch tensor to a NumPy array
            masks_np = results.masks.data.cpu().numpy()  # Add .cpu() if using GPU
            orig_shape = results.orig_shape

            # Now use np.any with the NumPy array
            combined_mask = np.any(masks_np, axis=0).astype(np.uint8)

            # ... (rest of your code) ...
            # Step 3: Calculate the total number of mask pixels
            total_mask_pixels = np.sum(combined_mask)

            # Step 4: Compute the total number of pixels in the image
            total_pixels = orig_shape[0] * orig_shape[1]

            # Step 5: Calculate the percentage coverage
            percentage_coverage = (total_mask_pixels / total_pixels) * 100

            print(
                f"Percentage coverage of masks in image '{results.path}': {percentage_coverage:.2f}%")
        else:
            print(f"No masks found in image '{results.path}'")
    return percentage_coverage, byte_io.getvalue()
