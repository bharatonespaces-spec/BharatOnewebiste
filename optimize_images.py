import os
from PIL import Image
import glob

IMAGE_DIR = "images"

# Dict mapping original filename to highly-optimized SEO filenames
RENAME_MAP = {
    "box-office-jasai.png": "bharatone-spaces-jasai-logistics-office.webp",
    "pune-slider-1.png": "bharatone-spaces-pune-camp-coworking-1.webp",
    "pune-slider-2.png": "bharatone-spaces-pune-camp-coworking-2.webp",
    "jasai-slider-1.jpg": "bharatone-spaces-jasai-private-cabin-1.webp",
    "jasai-slider-2.jpg": "bharatone-spaces-jasai-private-cabin-2.webp",
    "workspace.png": "bharatone-spaces-jasai-premium-workspace.webp",
    "meeting-room.png": "bharatone-spaces-jasai-meeting-room.webp",
    "reception.png": "bharatone-spaces-jasai-reception.webp",
    "logo.png": "bharatone-spaces-logo.webp"
}

def optimize_images():
    print("Starting image optimization...")
    files_to_convert = []
    for ext in ("*.png", "*.jpg", "*.jpeg"):
        files_to_convert.extend(glob.glob(os.path.join(IMAGE_DIR, ext)))

    for filepath in files_to_convert:
        filename = os.path.basename(filepath)
        name, _ = os.path.splitext(filename)
        
        # Decide new name
        if filename in RENAME_MAP:
            new_filename = RENAME_MAP[filename]
        else:
            new_filename = f"{name}.webp"
            
        new_filepath = os.path.join(IMAGE_DIR, new_filename)
        
        try:
            with Image.open(filepath) as img:
                # Convert RGBA to RGB if needed to save as WebP without alpha issues, though webp supports alpha
                img.save(new_filepath, "WEBP", quality=85)
                print(f"Converted {filename} -> {new_filename}")
        except Exception as e:
            print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    optimize_images()
