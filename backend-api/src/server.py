from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
import os.path
import imagegenerator
from fastapi.middleware.cors import CORSMiddleware

if os.path.exists("../.env.dev"):
    load_dotenv("../.env.dev")

# todo fix types
image_generator: imagegenerator.ImageGeneratorAI = imagegenerator.create_image_generator(
    os.getenv("DRY_RUN"),
    os.getenv("IMAGINE_API_KEY")
)

class GenerateImageRequest(BaseModel):
    attributes: List[str]
    product: str


class GenerateImageResponse(BaseModel):
    upscaled_images: List[str] = Field(default="upscaled-images")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/generate-image")
async def generate_image(
    req: GenerateImageRequest, response_model=GenerateImageResponse
):
    prompt: str = image_generator.generate_prompt(req.product, req.attributes)
    upscaled_image_links: List[str] = image_generator.generate_image_urls(prompt)

    return GenerateImageResponse(upscaled_images=upscaled_image_links)
