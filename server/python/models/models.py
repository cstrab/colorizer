from pydantic import BaseModel

class ColorMapping(BaseModel):
    initial_color: str
    target_color: str