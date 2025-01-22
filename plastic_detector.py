import numpy as np
from ultralytics import YOLO
import cv2


def transform(path):
    model = YOLO("E:\Project\Final Year\EcoVerse\garbage_yolov8-seg.pt")
    pred_img = model.predict(path, device='cpu')
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

    # # Load the image using OpenCV
    # image = cv2.imread(path)
    # # Convert the image from BGR (OpenCV default) to RGB (matplotlib default)
    # image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # # Extract the bounding boxes and labels from the results
    # for result in results:
    #     for box in result.boxes:
    #         # Get the coordinates of the bounding box
    #         x1, y1, x2, y2 = map(int, box.xyxy[0])
    #         # Get the confidence score of the prediction
    #         confidence = box.conf[0]

    #         # Draw the bounding box on the image
    #         cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    #         # Draw the confidence score near the bounding box
    #         cv2.putText(image, f'{confidence*100:.2f}%', (x1, y1 - 10),
    #                     cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
    # return pred_img[0]
    return percentage_coverage
