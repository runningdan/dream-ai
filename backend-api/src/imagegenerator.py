import http.client
import json

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
        data = {
            "prompt": prompt
        }
    
        headers = {
            'Authorization': 'Bearer ' + self.imagine_api_key
            'Content-Type': 'application/json'
        }
    
        conn = http.client.HTTPSConnection("demo.imagineapi.dev")
        conn.request("POST", "/items/images/", body=json.dumps(data), headers=headers)
    
        response = conn.getresponse()
        response_data = json.loads(response.read().decode('utf-8'))
    
        image_id = response_data["data"]["id"]
 
        max_time_out = 60
        iterations = 0

        while max_time_out > iterations:
            try:
                connection = http.client.HTTPSConnection("demo.imagineapi.dev")
                connection.request("GET", f"/items/images/{image_id}", headers=headers)
                response = connection.getresponse()
                get_images_response = json.loads(response.read().decode())

                if get_images_response["data"]["status"] == "complete":
                    return get_images_response["data"]["upscaled_urls"]

            except Exception as error:
                print(f"Error: {error}")

            iterations += 1