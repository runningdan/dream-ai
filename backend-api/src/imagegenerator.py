import http.client
import json

class ImageGeneratorAI:


    def __init__(self, imagine_api_key):
        self.imagine_api_key = imagine_api_key
        

    def (self, prompt):
        #

        data = {
            "prompt": "a pretty lady at the beach --ar 9:21 --chaos 40 --stylize 1000"
        }
    
        headers = {
            'Authorization': 'Bearer ' + self.imagine_api_key,  # <<<< TODO: remember to change this
            'Content-Type': 'application/json'
        }
    
        conn = http.client.HTTPSConnection("demo.imagineapi.dev")
        conn.request("POST", "/items/images/", body=json.dumps(data), headers=headers)
    
        response = conn.getresponse()
        response_data = json.loads(response.read().decode('utf-8'))
    
        print(response_data)