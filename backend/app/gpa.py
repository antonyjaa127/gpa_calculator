grade_map = {
    "AA": 4.0,
    "BA": 3.5,
    "BB": 3.0,
    "CB": 2.5,
    "CC": 2.0,
    "DC": 1.5,
    "DD": 1.0,
    "FF": 0.0
}


def convert_grade(grade_input):
    grade_input = str(grade_input).strip().upper()
    if grade_input in grade_map:
        return grade_map[grade_input]
    try:
        value = float(grade_input)
        if value < 0.0 or value > 4.0:
            raise ValueError
        return value
    except ValueError:
        raise ValueError(f"Geçersiz not girişi: {grade_input}")


def calculate_term_gpa(courses):
    total_points = 0
    total_credits = 0
    for grade, credit in courses:
        g = convert_grade(grade)
        total_points += g * credit
        total_credits += credit

    if total_credits == 0:
        return 0.0
    return total_points / total_credits


def calculate_cumulative_gpa(existing_gpa, existing_credits, new_courses):
    prev_total_points = existing_gpa * existing_credits

    new_total_points = 0
    new_total_credits = 0
    for grade, credit in new_courses:
        g = convert_grade(grade)
        new_total_points += g * credit
        new_total_credits += credit

    updated_total_points = prev_total_points + new_total_points
    updated_total_credits = existing_credits + new_total_credits

    if updated_total_credits == 0:
        return 0.0
    return updated_total_points / updated_total_credits


# Hem dönemlik hem de güncel GPA

def calculate_both_gpa(existing_gpa, existing_credits, new_courses):
    term_gpa = calculate_term_gpa(new_courses)

    if existing_gpa is None or existing_credits == 0:
        return {
            "term_gpa": term_gpa,
            "cumulative_gpa": term_gpa,
        }
    else:
        cumulative_gpa = calculate_cumulative_gpa(existing_gpa, existing_credits, new_courses)
        return {
            "term_gpa": term_gpa,
            "cumulative_gpa": cumulative_gpa,
        }
