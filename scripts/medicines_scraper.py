import aiohttp
import asyncio
import json
import pandas as pd
import os
import numpy as np
from openpyxl import load_workbook

# Function to read IDs from an Excel file
def read_ids_from_excel(file_path):
    try:
        df = pd.read_excel(file_path)
        df = df.dropna(subset=['barcode'])
        df['barcode'] = df['barcode'].astype(str)
        id_list = df['barcode'].tolist()
        return id_list
    except Exception as e:
        print("Error reading Excel file:", str(e))
        return []

# Initialize the id_list from an Excel file
excel_file_path = 'medicins.xlsx'
id_list = read_ids_from_excel(excel_file_path)[:1000]

# Initialize counters
success_count = 0
failure_count = 0
results = {}

async def scrape_url(session, semaphore, id):
    global success_count, failure_count, results
    try:
        async with semaphore:
            url = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer/SearchByName"
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "Your User Agent",
            }
            payload = {
                "val": str(id),
                "prescription": False,
                "healthServices": False,
                "pageIndex": 1,
                "orderBy": 0
            }

            async with session.post(url, headers=headers, data=json.dumps(payload)) as response:
                results[id] = 0
                if response.status == 200:
                    data = await response.json()
                    if "results" in data and len(data["results"]) > 0:
                        first_result = data["results"][0]
                        dragRegNum = first_result.get("dragRegNum")
                        if dragRegNum:
                            # print("Drag Registration Number for ID", id, ":", dragRegNum)
                            results[id] = dragRegNum
                            success_count += 1
                        else:
                            # print("No 'dragRegNum' found for ID", id)
                            failure_count += 1
                    else:
                        # print("No results found for ID", id)
                        failure_count += 1
                else:
                    print("Failed to retrieve data for ID:", id)
                    failure_count += 1
    


    except Exception as e:
        print("Error:", str(e))
        failure_count += 1

# Function to write results to a JSON file
def write_results_to_json(file_path, data):
    try:
        with open(file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Results written to {file_path}")
    except Exception as e:
        print("Error writing JSON file:", str(e))

async def main():   
    batch_size = 10
    semaphore = asyncio.Semaphore(batch_size)
    
    async with aiohttp.ClientSession() as session:
        tasks = [scrape_url(session, semaphore, id) for id in id_list]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())

# Print the counts at the end
print(f"Successfully extracted 'dragRegNum' for {success_count} IDs.")
print(f"Failed to extract 'dragRegNum' for {failure_count} IDs.")

# Write the results to a new JSON file
write_results_to_json('output.json', results)
