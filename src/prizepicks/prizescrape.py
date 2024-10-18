import cloudscraper
import json
import time
def fetch_data_from_api(url):
    # Create a Cloudflare-bypassing scraper
    scraper = cloudscraper.create_scraper()  
    try:
        # Make the GET request to the API
        response = scraper.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()  # Parse JSON data
        return data
    except cloudscraper.exceptions.CloudflareChallengeError as cf_err:
        print(f"Cloudflare challenge error occurred: {cf_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def process_data(data):
    # Process the data as needed
    # For example, print the data or extract specific fields
    print(json.dumps(data, indent=4))

def main():
    
    api_url = "https://api.prizepicks.com/projections?league_id=7&per_page=250&single_stat=true&game_mode=pickem"  # Replace with your API endpoint
    while(True):
        data = fetch_data_from_api(api_url)
        if data:
            process_data(data)
        time.sleep(60*10)


if __name__ == "__main__":
    main()
