import time

cache_store = {}

def get_cache(key):
    entry = cache_store.get(key)
    if not entry:
        return None, False

    now = time.time()

    if now < entry["expiry"]:
        return entry, False

    if now < entry["stale_expiry"]:
        return entry, True

    return None, False


def set_cache(key, data, ttl, stale_ttl):
    now = time.time()
    cache_store[key] = {
        "data": data,
        "expiry": now + ttl,
        "stale_expiry": now + stale_ttl,
        "timestamp": now
    }