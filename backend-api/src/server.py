from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Union
from dotenv import load_dotenv
import os.path
import imagegenerator
from fastapi.middleware.cors import CORSMiddleware
import cache
from loguru import logger

if os.path.exists("../.env.dev"):
    load_dotenv("../.env.dev")

image_generator: (
    Union[imagegenerator.ImageGeneratorAIDryRun, imagegenerator.ImageGeneratorAI]
) = imagegenerator.create_image_generator(
    os.getenv("DRY_RUN"), os.getenv("IMAGINE_API_KEY")
)

caching: cache.Cache = cache.Cache()


class GenerateImageRequest(BaseModel):
    attributes: List[str]
    product: str


class GenerateImageResponse(BaseModel):
    upscaled_images: List[str] = Field(alias="upscaled-images")

    class Config:
        populate_by_name = True


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
    cached_results: List[str] = caching.get_cached_results(req.attributes, req.product)
    if len(cached_results) > 0:
        logger.info("found image in cache for product: " + req.product)
        return GenerateImageResponse(upscaled_images=cached_results)

    prompt: str = image_generator.generate_prompt(req.product, req.attributes)
    upscaled_image_links: List[str] = image_generator.generate_image_urls(prompt)

    return GenerateImageResponse(upscaled_images=upscaled_image_links)
