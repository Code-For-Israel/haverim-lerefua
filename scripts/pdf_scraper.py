import json
import requests
import PyPDF2
import re
import langchain

# Load the JSON data from the file
with open('output.json', 'r') as file:
    data = json.load(file)

# Define the base URL for the brochure files
base_brochure_url = "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/"

# Define the endpoint URL for the drug information
endpoint_url = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer/GetSpecificDrug"

# Iterate through the keys and their values
for key, value in data.items():
    if value != 0:
        # Create the request body
        body = {"dragRegNum": value}

        # Send a POST request to get drug information
        response = requests.post(endpoint_url, json=body)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            print(f"Key: {key}, Value: {value} - Request successful")

            # Parse the JSON response
            response_data = response.json()

            # Extract the JSON object with lng = "עברית" from the "brochure" array
            for brochure_entry in response_data.get("brochure", []):
                if brochure_entry.get("lng") == "אנגלית":
                    brochure_url = brochure_entry.get("url")
                    print("Brochure URL:", brochure_url)

                    # Form the full brochure URL
                    full_brochure_url = base_brochure_url + brochure_url

                    print("full_url", full_brochure_url)

                    # Send a GET request to the brochure URL
                    brochure_response = requests.get(full_brochure_url)

                    # Check if the request was successful
                    if brochure_response.status_code == 200:
                        # Decode the content as UTF-8 with error handling
                        brochure_content = brochure_response.content

                        with open("my_pdf.pdf", 'wb') as my_data:
                            my_data.write(brochure_content)

                        # Open the PDF file and read all pages
                        with open("my_pdf.pdf", 'rb') as open_pdf_file:
                            read_pdf = PyPDF2.PdfReader(open_pdf_file)
                            all_text = ""
                            for page in read_pdf.pages:
                                all_text += page.extract_text() +"\n"
                            
                            match = re.search(r'store', all_text, re.IGNORECASE)
                            if match:
                                # Get the index where "store" was found
                                start_index = match.start()
                                
                                # Extract the next 500 characters after the match
                                extracted_text = all_text[start_index + 5:start_index + 505]  # Assuming "store" has 5 characters
                                
                                print("Extracted Text:", extracted_text)

                    else:
                        print(f"Brochure request failed with status code {brochure_response.status_code}")

                    break
        else:
            print(f"Key: {key}, Value: {value} - Request failed with status code {response.status_code}")
