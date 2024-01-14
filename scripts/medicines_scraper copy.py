import aiohttp
import asyncio
import json
import pandas as pd
import os
import numpy as np  # Import numpy for NaN handling
from openpyxl import load_workbook  # Import this library for Excel file writing

# Function to read IDs from an Excel file
def read_ids_from_excel(file_path):
    try:
        # Assuming that the Excel file has a column named 'ID' with the IDs
        df = pd.read_excel(file_path)
        
        # Remove NaN values from the 'barcode' column
        df = df.dropna(subset=['barcode'])
        df['barcode'] = df['barcode'].astype(str)
        
        id_list = df['barcode'].tolist()
        return id_list
    except Exception as e:
        print("Error reading Excel file:", str(e))
        return []

# Initialize the id_list from an Excel file
excel_file_path = 'medicins.xlsx'  # Replace with the path to your Excel file

# List of IDs to scrape
id_list = read_ids_from_excel(excel_file_path)
id_list = id_list[:20]

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
                "User-Agent": "Your User Agent",  # Replace with your user agent
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
                    # Check if "results" array is not empty
                    if "results" in data and len(data["results"]) > 0:
                        first_result = data["results"][0]
                        dragRegNum = first_result.get("dragRegNum")
                        if dragRegNum:
                            print("Drag Registration Number for ID", id, ":", dragRegNum)
                            results[id] = dragRegNum
                            success_count += 1
                        else:
                            print("No 'dragRegNum' found for ID", id)
                            failure_count += 1
                    else:
                        print("No results found for ID", id)
                        failure_count += 1
                else:
                    print("Failed to retrieve data for ID:", id)
                    failure_count += 1
                
    except Exception as e:
        print("Error:", str(e))
        failure_count += 1

def write_results_to_excel(output_file, results):
    global excel_file_path
    try:
        # Load the original Excel file
        df = pd.read_excel(excel_file_path)

        df['dragRegNum'] = df['barcode'].map(results)

        # Save the updated DataFrame to a new Excel file
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            writer.book = load_workbook(output_file)
            writer.sheets = dict((ws.title, ws) for ws in writer.book.worksheets)
            df.to_excel(writer, sheet_name='Sheet1', index=False)

        print(f"Results written to {output_file}")
    except Exception as e:
        print("Error writing Excel file:", str(e))


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

print(results)
 # Write the results to a new Excel file
write_results_to_excel('output.xlsx', results)