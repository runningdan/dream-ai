from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os.path

if os.path.exists(".env.dev"):
    load_dotenv(".env.dev")

class GenerateImageRequest(BaseModel):
    attributes: List[str]
    product: str

class GenerateImageResponse(BaseModel):
    upscaled_images: List[str]

app = FastAPI()

@app.post("/api/v1/generate-image")
async def generate_image(req: GenerateImageRequest, response_model=GenerateImageResponse):
    return GenerateImageResponse(
        upscaled_images=[
            "https://demo.imagineapi.dev/assets/00cc56e8-1797-4886-b268-d6bf2d89d583/00cc56e8-1797-4886-b268-d6bf2d89d583.png"
        ]
    )
