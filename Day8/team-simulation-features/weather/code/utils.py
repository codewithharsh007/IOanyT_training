import re

def normalize_city(city: str) -> str:
    return " ".join(city.strip().lower().split())


def validate_city(city: str) -> bool:
    pattern = r"^[a-zA-Z\s\-\.\']{2,100}$"
    return re.match(pattern, city.strip()) is not None