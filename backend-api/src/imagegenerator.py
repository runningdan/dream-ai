import http.client
import json
import time
from loguru import logger
from typing import Union

class ImageGenerationException(Exception):
    pass

class ImageGeneratorAI:
    def __init__(self, imagine_api_key):
        # constructor
        self.imagine_api_key = imagine_api_key

    def generate_prompt(self, product, attributes):
        # convert the desired product and an array of attributes
        # into a single string prompt that can be read and interpreted

        prompt = product + " with the following attributes: "
        for element in attributes:
            if element == attributes[-1] and len(attributes) == 1:
                prompt += element + "."
            elif element == attributes[-1] and len(attributes) > 1:
                prompt += "and " + element + "."
            else:
                prompt += element + ", "
        return prompt

    def generate_image_urls(self, prompt):
        data = {"prompt": prompt}

        headers = {
            "Authorization": "Bearer " + self.imagine_api_key,
            "Content-Type": "application/json",
        }

        conn = http.client.HTTPSConnection("demo.imagineapi.dev")
        conn.request("POST", "/items/images/", body=json.dumps(data), headers=headers)

        response = conn.getresponse()
        response_data = json.loads(response.read().decode("utf-8"))

        logger.info("response data: " + response_data)

        image_id = response_data["data"]["id"]

        max_time_out = 60
        iterations = 0

        while max_time_out > iterations:
            try:
                connection = http.client.HTTPSConnection("demo.imagineapi.dev")
                connection.request("GET", f"/items/images/{image_id}", headers=headers)
                response = connection.getresponse()
                get_images_response = json.loads(response.read().decode())

                logger.info("get image response data: " + get_images_response)

                if get_images_response["data"]["status"] == "completed":
                    return get_images_response["data"]["upscaled_urls"]

                if get_images_response["data"]["status"] == "failed":
                    raise ImageGenerationException(
                        "status failed when attempting to fetch image"
                    )

            except Exception as error:
                print(f"Error: {error}")

            iterations += 1

            time.sleep(5)

        raise TimeoutError("timeout exceeded when fetching images")

class ImageGeneratorAIDryRun(ImageGeneratorAI):
    def generate_image_urls(self, prompt):
        logger.debug("DRY RUN: prompt: " + prompt)
        return [
            "https://demo.imagineapi.dev/assets/073ba657-664b-4c0a-9a39-3eeae6252e2c/073ba657-664b-4c0a-9a39-3eeae6252e2c.png",
            "https://demo.imagineapi.dev/assets/416b55e0-8bb0-4010-8c4d-ffe710e85793/416b55e0-8bb0-4010-8c4d-ffe710e85793.png",
            "https://demo.imagineapi.dev/assets/09ec4563-0a79-437f-89f7-fe82e999475c/09ec4563-0a79-437f-89f7-fe82e999475c.png",
            "https://demo.imagineapi.dev/assets/0e3840fe-5c5f-4dd8-bf38-f34f36e7f4f6/0e3840fe-5c5f-4dd8-bf38-f34f36e7f4f6.png"
        ]

def create_image_generator(dry_run, api_key) -> Union[ImageGeneratorAIDryRun, ImageGeneratorAI]:
    if dry_run == "true":
        return ImageGeneratorAIDryRun(api_key)
    return ImageGeneratorAI(api_key)