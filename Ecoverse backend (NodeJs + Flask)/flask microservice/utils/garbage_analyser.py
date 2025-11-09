import numpy as np
from ultralytics import YOLO
import cv2
from io import BytesIO


def garbage_analyser(file):
    # from ultralytics import YOLO
    # from io import BytesIO
    # import numpy as np
    # import cv2

    # Load and decode image
    in_memory_file = BytesIO(file)
    img_array = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # Load model
    model = YOLO("E:/Project/Final Year/EcoVerse/garbage_yolov8-seg.pt")
    pred = model.predict(img, device='cpu')[0]

    # Save annotated image
    success, encoded_image = cv2.imencode('.png', pred.plot())
    byte_io = BytesIO(encoded_image.tobytes())

    if pred.masks is None or pred.boxes is None:
        print("No masks or boxes found.")
        return 0, byte_io.getvalue()

    masks_np = pred.masks.data.cpu().numpy()
    confs = pred.boxes.conf.cpu().numpy()
    class_ids = pred.boxes.cls.cpu().numpy()
    orig_h, orig_w = pred.orig_shape

    # Define class names (index to label)
    class_names = {
        0: 'Aluminium_foil', 1: 'Background', 2: 'Cardboard', 3: 'Cig_bud', 4: 'Cig_pack',
        5: 'Disposable', 6: 'E-Waste', 7: 'Foam Paper', 8: 'Foam cups and plates', 9: 'Garbage',
        10: 'Glass_bottle', 11: 'Light bulbs', 12: 'Mask', 13: 'Metal', 14: 'Nylon_sting',
        15: 'Other_Contaminated', 16: 'Papar_Cup', 17: 'Paper', 18: 'Plastic', 19: 'Plastic_Bag',
        20: 'Plastic_Container', 21: 'Plastic_Glass', 22: 'Plastic_Straw', 23: 'Plastic_bottle',
        24: 'Plastic_tray', 25: 'Plastic_wraper', 26: 'Rubber', 27: 'Steel_Bottle',
        28: 'Tetrapack', 29: 'Thermocol', 30: 'Toothpaste', 31: 'can', 32: 'contaminated_waste',
        33: 'diaper', 34: 'top_view_waste', 35: 'wood'
    }

    # Weighting logic
    def get_weight(class_name):
        if class_name == 'Garbage':
            return 3.0
        elif class_name.startswith('Plastic'):
            return 2.5
        elif class_name in ['Plastic_bottle', 'Plastic_wraper', 'Plastic_Bag', 'contaminated_waste']:
            return 3.0
        else:
            return 1.0

    weighted_pixel_sum = 0
    total_pixels = orig_h * orig_w

    for i, mask in enumerate(masks_np):
        if confs[i] < 0.2:
            continue

        class_id = int(class_ids[i])
        class_name = class_names.get(class_id, 'Unknown')
        weight = get_weight(class_name)

        pixel_count = np.sum(mask)
        weighted_pixel_sum += pixel_count * weight

    if weighted_pixel_sum == 0:
        print("No valid high-confidence masks.")
        return 0, byte_io.getvalue()

    # Scale to get coverage percentage
    coverage = (weighted_pixel_sum / total_pixels) * 100

    # Apply nonlinear boost to reflect severity
    pollution_score = min((coverage ** 1.3), 100)

    print(
        f"Coverage: {coverage:.2f}% → Pollution Score: {pollution_score:.2f}")
    return pollution_score, byte_io.getvalue()
