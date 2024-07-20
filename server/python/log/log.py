import logging
from logging.handlers import RotatingFileHandler
import sys
import os

LOG_DIR_PATH = './tmp/'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
MODE = 'a'
MAX_BYTES = 10 * 1024 * 1024
BACKUP_COUNT = 5

def setup_logger(name, level=logging.INFO):
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        if isinstance(level, str):
            level = getattr(logging, level.upper(), logging.INFO)
        
        logger.setLevel(level)
        
        os.makedirs(LOG_DIR_PATH, exist_ok=True)
        
        log_file_path = os.path.join(LOG_DIR_PATH, f"{name}.log")
        
        file_handler = RotatingFileHandler(log_file_path, mode=MODE, maxBytes=MAX_BYTES, backupCount=BACKUP_COUNT)
        file_handler.setLevel(level)
        
        formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)
        file_handler.setFormatter(formatter)
        
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
    
    return logger

def get_logger(name="server"):
    return logging.getLogger(name)

def init_logger(name, level=logging.INFO):
    return setup_logger(name, level)