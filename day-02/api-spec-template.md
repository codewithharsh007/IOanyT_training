# API Specification Template

## Endpoint: [Product Search]

### Overview

**Method**: GET
**URL**: `/api/v1/search/products`
**Description**: Search products by name with partial matching and filtering support
**Authentication**: Required

### Request

**Headers**:
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | Must be application/json |

**Query Parameters**:
| Parameters | Type | Required | Default | Description |
| ---------- | ------ | -------- | --------- | ----------------------------------------------------------- |
| q | string | Yes | — | Search query (min 1 char, max 200 chars) |
| limit | int | No | 20 | Number of results per page (max 50) |
| cursor | string | No | null | Cursor for pagination |
| category | string | No | null | Filter by category slug (e.g. `electronics`) |
| min_price | float | No | 0 | Minimum price filter |
| max_price | float | No | 100000 | Maximum price filter |
| in_stock | bool | No | false | Filter only in-stock products |
| sort_by | string | No | relevance | Field to sort by (`relevance`, `price`, `rating`, `newest`) |
| sort_order | string | No | desc | Sort order (`asc` or `desc`) |

**Request Body** (if POST/PUT):

```json
{}
```

### Response

**Success (200)**:

```json
{
  "query": "head",
  "totalResults": 842,
  "limit": 20,
  "nextCursor": "eyJpZCI6IjEwMDk5In0=",
  "results": [
    {
      "id": "P10091",
      "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      "category": "electronics",
      "price": 299.99,
      "currency": "USD",
      "thumbnail": "https://cdn.shopeasy.com/products/P10091.jpg",
      "rating": 4.7,
      "reviewCount": 12453,
      "inStock": true
    },
    {
      "id": "P20311",
      "name": "Cotton Sports Headband - Black",
      "category": "fashion",
      "price": 9.99,
      "currency": "USD",
      "thumbnail": "https://cdn.shopeasy.com/products/P20311.jpg",
      "rating": 4.3,
      "reviewCount": 842,
      "inStock": true
    },
    {
      "id": "P30988",
      "name": "Boat Rockerz 450 Bluetooth Headphones",
      "category": "electronics",
      "price": 49.99,
      "currency": "USD",
      "thumbnail": "https://cdn.shopeasy.com/products/P30988.jpg",
      "rating": 4.1,
      "reviewCount": 5321,
      "inStock": false
    }
  ]
}
```

**Error Responses**:
| Status | Error Code | Description |
| ------ | ------------- | ------------------------------------------------------------------------------------------- |
| 400 | INVALID_QUERY | Query is missing, empty, only whitespace, exceeds 200 characters, or contains invalid input |
| 401 | UNAUTHORIZED | Missing or invalid authentication token |
| 429 | RATE_LIMITED | Too many requests; user exceeded rate limit (100 requests/minute) |
| 500 | SERVER_ERROR | Unexpected server-side failure |

### Edge Cases

| Scenario                                         | Behavior                                                       |
| ------------------------------------------------ | -------------------------------------------------------------- |
| Empty search query (`""` or whitespace)          | Return `400 INVALID_QUERY`                                     |
| Query longer than 200 characters                 | Return `400 INVALID_QUERY`                                     |
| Special characters (`&, %, #, @`)                | Safely sanitized and ignored if not meaningful                 |
| SQL/NoSQL injection attempts (`" OR 1=1`, `$gt`) | Treated as plain text; no execution risk                       |
| No results found                                 | Return `200 OK` with `totalResults: 0` and empty `results: []` |
| Very broad queries (e.g. "a")                    | Return first page only, require pagination via cursor          |

### Performance Notes

- Expected latency: < 200ms
- Indexing strategy: [
  - Use Elasticsearch with edge n-gram tokenizer on product name
  - Example tokens: "headphones" → h, he, hea, head
  - Indexed fields:
    - name (text, n-gram for partial match)
    - category (keyword)
    - price (numeric)
    - inStock (boolean)]
- Caching: [
  - Use Redis to cache frequent queries (e.g. "iphone", "shirt")
  - Cache key format:
    - search:{q}:{category}:{min_price}:{max_price}:{in_stock}:{cursor}:{limit}
  - TTL: 60 seconds
  - Cache hit response time: ~5–10ms]

### Pagination

- Cursor-based pagination (chosen over offset for consistent performance at large result sets like 8,000+ items)
- Default page size: [20]
- Max page size: [50]

### Behavior:

- nextCursor returned when more results exist
- Cursor is base64-encoded JSON containing:
  - last product ID
  - relevance score

### Example Flow:

    1.  First request:
        /api/v1/search/products?q=shirt
    2.  Use returned cursor:
        /api/v1/search/products?q=shirt&cursor=eyJsYXN0SWQiOiJQMTAwOTEiLCJzY29yZSI6MC45OH0=
