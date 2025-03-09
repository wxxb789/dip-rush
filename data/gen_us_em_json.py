 #!/usr/bin/env python3
"""
Script to convert a CSV file into JSON format.
The script creates a dictionary with the 2nd column as keys
and the 1st column as values, then writes it to a JSON file.
"""

import csv
import json
import sys

def csv_to_json(csv_file_path):
    """
    Convert CSV to JSON where 2nd column becomes the key and 1st column becomes the value.
    
    Args:
        csv_file_path (str): Path to the input CSV file
        
    Returns:
        dict: Dictionary with 2nd column as keys and 1st column as values
    """
    result = {}
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            csv_reader = csv.reader(csv_file)
            for row in csv_reader:
                if len(row) >= 2:  # Ensure row has at least 2 columns
                    key = row[1]
                    value = row[0]
                    result[key] = value
    except Exception as e:
        print(f"Error reading CSV file: {e}", file=sys.stderr)
        sys.exit(1)
    
    return result

def main():
    if len(sys.argv) != 2:
        print("Usage: python gen_us_em_json.py <csv_file_path>", file=sys.stderr)
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    result_dict = csv_to_json(csv_file_path)
    
    # Write JSON to stdout
    # print(json.dumps(result_dict, indent=2))

    json.dump(result_dict, open('us_em.json', 'w'), indent=2)

if __name__ == "__main__":
    main()