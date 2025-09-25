from serpapi import GoogleSearch
import os
from dotenv import load_dotenv
import json

load_dotenv()

def get_shopping_results(product_name):
    try:
        params = {
            "api_key": os.environ.get('SERP_API_KEY'),
            "engine": "google",
            "q": product_name,
            "location": "Brisbane, Queensland, Australia",
            "google_domain": "google.com.au",
            "gl": "au",
            "hl": "en",
            "tbm": "shop",
            "start": "0",
            "num": "5"
        }
        search = GoogleSearch(params)
        return search.get_dict()
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return []
    
def write_results_to_file(results, filename):
    product_name = product_name.replace(" ", "_")
    file_name = "examples/{product_name}_results.json"
    with open(filename, 'w') as f:
        # Write results to file
        json.dump(results, f, indent=4)
    
    
def get_dummy_results(product_name: str):
    product_name = product_name.replace(" ", "_")
    file_name = "examples/gym_shorts_results.json"
    # file_name = f"examples/{product_name}_results.json"
    try:
        with open(file_name, 'r') as f:
            results = json.load(f)
            return results
    except FileNotFoundError:
        file_name = "backend/examples/gym_shorts_results.json"
        with open(file_name, 'r') as f:
            results = json.load(f)
            return results
    


if __name__ == "__main__":
    product_name = "gym shorts"
    results = get_dummy_results(product_name)
    # results = get_shopping_results(product_name)
    # write_results_to_file(results, f"backend/examples/{product_name}_results.json")
    # print(results)
    