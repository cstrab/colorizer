import asyncio
import io
import os
from PIL import Image
import webcolors
from zipfile import ZipFile

from log.log import get_logger

logger = get_logger()

def iter_file(file_like):
    chunk_size = 4096
    while chunk := file_like.read(chunk_size):
        yield chunk

async def process_single_image(file_name, file_content, color_extension, color_mapping):
    logger.info(f"Processing image: {file_name}")
    image = Image.open(io.BytesIO(file_content)).convert("RGBA")
    processed_image = replace_colors(image, color_mapping)
    img_byte_arr = io.BytesIO()
    processed_image.save(img_byte_arr, format='PNG', optimize=True, quality=100)
    img_byte_arr = img_byte_arr.getvalue()

    base_name, extension = os.path.splitext(file_name)
    new_file_name = base_name + color_extension + extension

    return (new_file_name, img_byte_arr)

async def worker(queue, color_extension, color_mapping, results):
    while True:
        file_name, file_content = await queue.get()
        try:
            result = await process_single_image(file_name, file_content, color_extension, color_mapping)
            results.append(result)
        except Exception as e:
            logger.error(f"Error processing {file_name}: {str(e)}")
        finally:
            queue.task_done()

async def process_images(input_zip_bytes, color_extension, color_mapping, num_workers):
    logger.info(f"Processing images with {num_workers} workers")
    input_zip = ZipFile(io.BytesIO(input_zip_bytes), 'r')
    output_zip_bytes = io.BytesIO()
    output_zip = ZipFile(output_zip_bytes, 'w')

    queue = asyncio.Queue()
    results = []

    workers = [asyncio.create_task(worker(queue, color_extension, color_mapping, results)) 
               for _ in range(num_workers)]

    for file_name in input_zip.namelist():
        file_content = input_zip.read(file_name)
        await queue.put((file_name, file_content))

    await queue.join()

    for w in workers:
        w.cancel()

    for new_file_name, img_byte_arr in results:
        output_zip.writestr(new_file_name, img_byte_arr)

    output_zip.close()
    output_zip_bytes.seek(0)
    return output_zip_bytes

def replace_colors(image, color_mapping):
    logger.info("Replacing colors")
    width, height = image.size
    pixels = image.load()

    for x in range(width):
        for y in range(height):
            pixel = pixels[x, y]
            for mapping in color_mapping:
                initial_color = webcolors.hex_to_rgb(mapping.initial_color)
                target_color = webcolors.hex_to_rgb(mapping.target_color)
                if pixel[:3] == initial_color:
                    new_pixel = target_color + (pixel[3],)
                    pixels[x, y] = new_pixel
                    break

    return image