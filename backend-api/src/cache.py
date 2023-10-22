from pydantic import BaseModel 
from typing import List, Dict
from loguru import logger

class ImageData:
    def __init__(self, attributes: List[str], product: str):
        self.attributes: List[str] = attributes
        self.product: str = product

    def __hash__(self):
        return hash((str(self.attributes), self.product))

class Cache:
    def __init__(self):
        self.cache: Dict[str, List[str]] = {}
        self.add_image_to_cache(["diamond","gold","accent","chain necklace"], "Necklace", [
            "https://demo.imagineapi.dev/assets/985d6c06-fdac-4ec4-a961-bdcce4915ab0/985d6c06-fdac-4ec4-a961-bdcce4915ab0.png",
            "https://demo.imagineapi.dev/assets/ece533b3-762d-4843-bee4-8c23b22a8309/ece533b3-762d-4843-bee4-8c23b22a8309.png",
            "https://demo.imagineapi.dev/assets/23fdfa06-284e-4c0e-bc49-ea349fdcbb92/23fdfa06-284e-4c0e-bc49-ea349fdcbb92.png",
            "https://demo.imagineapi.dev/assets/55ffdbee-b701-4969-bb43-a727f4661915/55ffdbee-b701-4969-bb43-a727f4661915.png"
        ])
        self.add_image_to_cache(["luxury", "white dial", "marble pattern", "alligator leather strap"], "Watch", [
            "https://demo.imagineapi.dev/assets/073ba657-664b-4c0a-9a39-3eeae6252e2c/073ba657-664b-4c0a-9a39-3eeae6252e2c.png",
            "https://demo.imagineapi.dev/assets/416b55e0-8bb0-4010-8c4d-ffe710e85793/416b55e0-8bb0-4010-8c4d-ffe710e85793.png",
            "https://demo.imagineapi.dev/assets/09ec4563-0a79-437f-89f7-fe82e999475c/09ec4563-0a79-437f-89f7-fe82e999475c.png",
            "https://demo.imagineapi.dev/assets/0e3840fe-5c5f-4dd8-bf38-f34f36e7f4f6/0e3840fe-5c5f-4dd8-bf38-f34f36e7f4f6.png"
        ])

    def add_image_to_cache(self, attributes: List[str], product: str, upscaled_links: List[str]):
        image_hash: str = hash(ImageData(attributes, product))
        logger.info(f"image hash created: {image_hash} for product: {product}")
        self.cache[image_hash] = upscaled_links

    def get_cached_results(self, attributes: List[str], product: str) -> List[str]:
        image_hash: str = hash(ImageData(attributes, product))
        if image_hash in self.cache:
            return self.cache[image_hash]
        return []


