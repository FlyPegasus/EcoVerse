import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# Configuration
cloudinary.config(
    cloud_name="dejvjzd81",
    api_key="476128522134858",
    # Click 'View API Keys' above to copy your API secret
    api_secret="-0YogDqKpm7jvTjTHcizVwRDci4",
    secure=True
)

# Upload an image
upload_result = cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
                                           public_id="shoes")
print(upload_result["secure_url"])

# Optimize delivery by resizing and applying auto-format and auto-quality
optimize_url, _ = cloudinary_url("shoes", fetch_format="auto", quality="auto")
print(optimize_url)

# Transform the image: auto-crop to square aspect_ratio
auto_crop_url, _ = cloudinary_url(
    "shoes", width=500, height=500, crop="auto", gravity="auto")
print(auto_crop_url)


def analysed_image_url(img):
    # Upload an image
    upload_result = cloudinary.uploader.upload(img)
    return upload_result["secure_url"]
