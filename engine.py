#!/usr/bin/env python3
import sys
import json
import urllib.parse

def reduce_number(n):
    """Reduces a number to a single digit (1-9) or master number (11, 22, 33)."""
    while n > 9 and n not in [11, 22, 33]:
        n = sum(int(digit) for digit in str(n))
    return n

def calculate_vector(text):
    """Simple example logic for mapping a string vector to a Gnothology metric."""
    score = sum(ord(char) for char in text.upper() if char.isalnum())
    return reduce_number(score)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No payload provided"}))
        sys.exit(1)

    try:
        # Decode the incoming Base64/URL payload passed by server.js
        raw_payload = sys.argv[1]
        decoded_str = urllib.parse.unquote(raw_payload)
        data = json.loads(decoded_str)

        name = data.get("name", "Unknown")
        dob = data.get("dob", "0000-00-00")

        # Gnothology Framework Calculations
        radical_blueprint = calculate_vector(name)
        evolutionary_trajectory = calculate_vector(dob.replace("-", ""))
        kinetic_frequency = reduce_number(radical_blueprint + evolutionary_trajectory)
        tension_gap = abs(radical_blueprint - evolutionary_trajectory)

        # Output payload mapping cleanly to report-template variables
        report_data = {
            "status": "success",
            "meta": {"name": name, "dob": dob},
            "vectors": {
                "radical_blueprint": radical_blueprint,
                "evolutionary_trajectory": evolutionary_trajectory,
                "kinetic_frequency": kinetic_frequency,
                "tension_gap": tension_gap
            }
        }
        
        print(json.dumps(report_data))

    except Exception as e:
        print(json.dumps({"error": f"Defensive parsing failure: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
