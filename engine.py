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

def get_gnothology_profile(vector_type, number):
    profiles = {
        "radical": {
            1: {"title": "Strategic Pioneer", "desc": "Driven by singular architectural independence and localized structural initiation."},
            2: {"title": "Systemic Bridge", "desc": "Operates through diplomatic calibration, cooperative integration, and relational logic."},
            3: {"title": "Expression Vector", "desc": "Traces paths of creative synthesis, rapid communication, and conceptual expansion."},
            4: {"title": "Structural Grid", "desc": "Anchored in system stability, structural integrity, and process optimization."},
            5: {"title": "Dynamic Pivot", "desc": "Defined by kinetic variance, field exploration, and rapid interface iteration."},
            6: {"title": "Harmonic Anchor", "desc": "Centered on localized systems custodianship, protective symmetry, and community equilibrium."},
            7: {"title": "Diagnostic Core", "desc": "Built for deep analytical isolation, truth telemetry, and architectural debugging."},
            8: {"title": "Execution Engine", "desc": "Optimized for scaled operational output, material governance, and resource execution."},
            9: {"title": "Universal Node", "desc": "Focused on systemic closure, open-source idealism, and network resolution."},
            11: {"title": "Master Antenna", "desc": "Channels high-frequency intuitive telemetry across non-linear spatial domains."},
            22: {"title": "Master Builder", "desc": "Engineered for scaled structural manifestation and macroscopic infrastructure builds."},
            33: {"title": "Master Conduit", "desc": "Sustains widespread harmonic calibration across active ecosystem environments."}
        }
    }
    return profiles.get(vector_type, {}).get(number, {"title": "Undifferentiated Node", "desc": "Matrix baseline optimization ongoing."})

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
    
    # Core Numerics
    life_path_sum = sum(int(d) for d in f"{month}{day}{year}" if d.isdigit())
    life_path = reduce_to_digit(life_path_sum, allow_master=True)
    
    total_name_sum = sum(calculate_pythagorean_value(c) for c in full_birth_name if c.isalpha())
    expression = reduce_to_digit(total_name_sum, allow_master=True)
    
    present_numbers = set(calculate_pythagorean_value(c) for c in full_birth_name if c.isalpha())
    missing_numbers = set(range(1, 10)) - present_numbers
    missing_count = len(missing_numbers)
    subconscious_num = reduce_to_digit(missing_count) if missing_count > 0 else 9
    
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
    
    # Advanced Tension Arrays
    tension_gap = abs(expression - day)
    alignment_coefficient = round(tension_gap / life_path, 2) if life_path else 0
    variance = abs(life_path - expression) + abs(expression - subconscious_num) + abs(subconscious_num - life_path)
    uspc_score = max(10, round(100 - (variance * 4.5), 1))
    
    archetype = "Dynamic Adaptation" if uspc_score >= 65 else "Friction Catalyst"
    if uspc_score >= 85: archetype = "Harmonic Convergence"
    
    # Extract profiles from library
    lp_profile = get_gnothology_profile("radical", life_path)
    
    return {
        "life_path": life_path,
        "life_path_title": lp_profile["title"],
        "life_path_desc": lp_profile["desc"],
        "expression": expression,
        "subconscious_num": subconscious_num,
        "hcv": hcv,
        "alignment_coefficient": alignment_coefficient,
        "uspc_score": f"{uspc_score}%",
        "archetype": archetype
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
        fallback = {"life_path": 7, "life_path_title": "Diagnostic Core", "life_path_desc": "Built for analytical isolation.", "expression": 2, "subconscious_num": 9, "hcv": 2, "alignment_coefficient": 1.71, "uspc_score": "37.0%", "archetype": "Friction Catalyst"}
        print(json.dumps(fallback))
