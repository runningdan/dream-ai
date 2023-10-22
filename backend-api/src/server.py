from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os.path
import imagegenerator


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
    upscaled_images: List[str]


app = FastAPI()


@app.post("/api/v1/generate-image")
async def generate_image(
    req: GenerateImageRequest, response_model=GenerateImageResponse
):
    prompt: str = image_generator.generate_prompt(req.product, req.attributes)
    upscaled_image_links: List[str] = image_generator.generate_image_urls(prompt)

    return GenerateImageResponse(upscaled_images=upscaled_image_links)
