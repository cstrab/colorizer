import json
from fastapi import File, UploadFile, HTTPException, Form, Request
from fastapi.responses import StreamingResponse

from utils.process import process_images, iter_file
from log.log import get_logger
from models.models import ColorMapping

logger = get_logger()

async def colorize_images(
    request: Request,
    file: UploadFile = File(...),
    color_extension: str = Form(...),
    color_mapping: str = Form(...)
):
    num_workers = request.app.state.num_workers
    
    if not file.filename.endswith('.zip'):
        logger.error(f"Invalid file format: {file.filename}")
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .zip file.")
    if not color_extension:
        logger.error("Color extension is required.")
        raise HTTPException(status_code=400, detail="Color extension is required.")
    if not color_mapping:
        logger.error("Color mapping is required.")
        raise HTTPException(status_code=400, detail="Color mapping is required.")

    try:
        color_mapping = [ColorMapping(**cm) for cm in json.loads(color_mapping)]
    except Exception as e:
        logger.error(f"Invalid color mapping format: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid color mapping format.")

    try:
        zip_bytes = await file.read()
        output_zip_bytes = await process_images(zip_bytes, color_extension, color_mapping, num_workers)

        if output_zip_bytes is None:
            logger.error("Image processing failed.")
            raise HTTPException(status_code=500, detail="Image processing failed.")

        output_zip_bytes.seek(0)
        original_filename = file.filename.rsplit('.', 1)[0]

        return StreamingResponse(iter_file(output_zip_bytes), media_type="application/zip", headers={
            "Content-Disposition": f"attachment; filename=\"{original_filename}{color_extension}.zip\""
        })
    except Exception as e:
        logger.error(f"Failed to process file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")