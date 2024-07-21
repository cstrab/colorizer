import argparse
from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

from log.log import init_logger
from handlers.colorize import colorize_images

API_PREFIX = "/api"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

@app.post(f"{API_PREFIX}/colorize")
async def colorize_images_route(request: Request, file: UploadFile = File(...), color_extension: str = Form(...), color_mapping: str = Form(...)):
    return await colorize_images(request, file, color_extension, color_mapping)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Colorizer Server")
    parser.add_argument("--host", default="localhost", help="Host address")
    parser.add_argument("--port", default=8080, type=int, help="Port number")
    parser.add_argument("--log-level", default=logging.INFO, help="Log level")
    parser.add_argument("--num-workers", default=4, type=int, help="Number of worker processes")
    args = parser.parse_args()

    logger = init_logger("api", args.log_level)
    logger.info(f"Starting server at {args.host}:{args.port} with {args.num_workers} workers")

    app.state.num_workers = args.num_workers

    uvicorn.run(app, host=args.host, port=args.port)