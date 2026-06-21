import sys
import json

def calculate_pythagorean_value(char):
    mapping = {
        'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9,
        'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':6, 'P':7, 'Q':8, 'R':9,
        'S':1, 'T':2, 'U':3, 'V':4, 'W':5, 'X':6, 'Y':7, 'Z':8
    }
    return mapping.get(char.upper(), 0)

def reduce_to_digit(num, allow_master=True):
    while num > 9:
        if allow_master and num in [11, 22, 33]:
            return num
        num = sum(int(digit) for digit in str(num))
    return num

def get_vector_meaning(number):
    meanings = {
        1: "Initiation & Sovereignty (The Spark of Individual Action)",
        2: "Symmetry & Calibration (The Pulse of Relationship and Detail)",
        3: "Synthesis & Radiance (The Flow of Creative Expression)",
        4: "Stability & Perimeter (The Grid of Process and Foundation)",
        5: "Variance & Motion (The Frequency of Fluid Transition)",
        6: "Equilibrium & Custodianship (The Anchor of Group Harmony)",
        7: "Isolation & Diagnostic (The Architecture of Inner Truth)",
        8: "Scale & Operational Impact (The Engine of Material Execution)",
        9: "Resolution & Network Completion (The Horizon of Open-Source Wisdom)"
    }
    return meanings.get(number, "Baseline Universal Parameter")

def compute_matrices(full_birth_name, current_name, dob_str):
    full_birth_name = (full_birth_name or "").strip().upper()
    current_name = (current_name or "").strip().upper()
    dob_str = (dob_str or "").strip()

    try:
        parts = [int(p) for p in dob_str.split('-') if p.isdigit()]
        if len(parts) < 3: parts = [9, 14, 1991]
    except Exception:
        parts = [9, 14, 1991]

    if parts[0] > 12:
        year, month, day = parts[0], parts[1], parts[2]
    else:
        month, day, year = parts[0], parts[1], parts[2]
    
    # Core Vectors
    life_path_sum = sum(int(d) for d in f"{month}{day}{year}" if d.isdigit())
    life_path = reduce_to_digit(life_path_sum, allow_master=True)
    
    total_name_sum = sum(calculate_pythagorean_value(c) for c in full_birth_name if c.isalpha())
    expression = reduce_to_digit(total_name_sum, allow_master=True)
    
    present_numbers = set(calculate_pythagorean_value(c) for c in full_birth_name if c.isalpha())
    all_digits = set(range(1, 10))
    missing_numbers = sorted(list(all_digits - present_numbers))
    subconscious_num = reduce_to_digit(len(missing_numbers)) if missing_numbers else 9
    
    vowels = set("AEIOU")
    consonants = [c for c in current_name if c.isalpha() and c not in vowels]
    freq_map = {}
    for c in consonants:
        val = calculate_pythagorean_value(c)
        freq_map[val] = freq_map.get(val, 0) + 1
        
    if freq_map:
        max_freq = max(freq_map.values())
        climax_values = [k for k, v in freq_map.items() if v == max_freq]
        climax_value = reduce_to_digit(sum(climax_values), allow_master=False)
    else:
        climax_value = 0
        
    reduced_day = reduce_to_digit(day, allow_master=False)
    hcv = reduce_to_digit(climax_value * reduced_day, allow_master=True)
    
    # Tension Diagnostics
    tension_gap = abs(expression - day)
    alignment_coefficient = round(tension_gap / life_path, 2) if life_path else 0
    variance = abs(life_path - expression) + abs(expression - subconscious_num) + abs(subconscious_num - life_path)
    uspc_score = max(10, round(100 - (variance * 4.5), 1))
    
    archetype = "Dynamic Adaptation" if uspc_score >= 65 else "Friction Catalyst"
    if uspc_score >= 85: archetype = "Harmonic Convergence"
    
    # Format descriptive vectors for missing frequencies
    missing_str = ", ".join([str(n) for n in missing_numbers]) if missing_numbers else "None (Fully Integrated Matrix)"
    missing_meanings = "; ".join([get_vector_meaning(n) for n in missing_numbers[:2]]) if missing_numbers else "All native parameters active."
    
    return {
        "life_path": life_path,
        "expression": expression,
        "subconscious_num": subconscious_num,
        "hcv": hcv,
        "alignment_coefficient": alignment_coefficient,
        "uspc_score": f"{uspc_score}%",
        "archetype": archetype,
        "tension_gap": tension_gap,
        "missing_vectors": missing_str,
        "missing_meanings": missing_meanings
    }

if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        input_data = json.loads(raw_input) if raw_input else {}
        results = compute_matrices(
            input_data.get('full_birth_name', ""),
            input_data.get('current_name', ""),
            input_data.get('dob', "09-14-1991")
        )
        print(json.dumps(results))
    except Exception:
        fallback = {"life_path": 7, "expression": 2, "subconscious_num": 9, "hcv": 2, "alignment_coefficient": 1.71, "uspc_score": "37.0%", "archetype": "Friction Catalyst", "tension_gap": 5, "missing_vectors": "3, 4, 5", "missing_meanings": "Creative Synthesis; Structural Integrity"}
        print(json.dumps(fallback))
