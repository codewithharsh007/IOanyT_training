# DRT Invoice Automation — Tech Stack & Architecture Guide

> **Purpose:** Parse DRT Transportation invoice PDFs in bulk and export structured data into a formatted Excel workbook for analysis.

---

## Project Overview

The company has 10+ years of freight invoices stored as PDFs. Each invoice contains:
- Header info (invoice #, dates, payment terms, reference numbers)
- Party details (Bill To, Shipper, Consignee with addresses)
- Carrier info (SCAC code, carrier name, pro number)
- Freight line items (description, class, pallets, pieces, weight)
- Charge summary (freight, fuel, discount, lumper, inspection, total)

**Goal:** Automate extraction of all this data → clean, analysis-ready Excel workbook.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      INPUT LAYER                                │
│   /invoices/                                                    │
│   ├── DRU45097-SO25000283.pdf                                   │
│   ├── DRU45166-SO25000214.pdf                                   │
│   └── ... (hundreds/thousands of PDFs)                          │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PARSING LAYER (Python)                       │
│                                                                 │
│   pdfplumber                                                    │
│   ├── Extract raw text from each PDF page                       │
│   ├── Regex pattern matching for header fields                  │
│   ├── Table detection for line items (Charges Detail)           │
│   └── Address block extraction                                  │
│                                                                 │
│   Output: List of structured invoice dicts                      │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPORT LAYER (Python)                         │
│                                                                 │
│   openpyxl                                                      │
│   ├── Sheet 1: Invoice Summary (1 row per invoice)              │
│   ├── Sheet 2: Line Item Detail (1 row per freight line)        │
│   └── Sheet 3: Analysis Dashboard (KPIs + charge breakdown)     │
│                                                                 │
│   Output: DRT_Invoices.xlsx                                     │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OUTPUT LAYER                                │
│   /output/                                                      │
│   ├── DRT_Invoices.xlsx     ← primary deliverable               │
│   └── DRT_Invoices_raw.json ← optional debug log                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Core Language
| Technology | Version | Role |
|------------|---------|------|
| Python | 3.9+ | Primary scripting language |

### Libraries

| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| **pdfplumber** | ≥0.10 | Extract text from PDF pages, handle multi-page PDFs | `pip install pdfplumber` |
| **openpyxl** | ≥3.1 | Create/format Excel workbooks, formulas, tables, conditional formatting | `pip install openpyxl` |
| **tqdm** | ≥4.0 | Progress bar for batch processing | `pip install tqdm` |
| **re** | built-in | Regex pattern matching for field extraction | — |
| **pathlib** | built-in | Cross-platform file/folder path handling | — |
| **argparse** | built-in | CLI argument parsing (`--input`, `--output`) | — |
| **json** | built-in | Optional raw data logging for debugging | — |

### Full Install Command
```bash
pip install pdfplumber openpyxl tqdm
```

---

## File & Folder Structure

```
project/
├── parsing_script.py          ← main automation script
├── requirements.txt           ← pip dependencies
├── invoices/                  ← put all PDF invoices here
│   ├── 2015/
│   │   └── *.pdf
│   ├── 2016/
│   │   └── *.pdf
│   └── ...                    (script scans subfolders recursively)
└── output/
    ├── DRT_Invoices.xlsx      ← generated Excel file
    └── DRT_Invoices_raw.json  ← optional debug JSON
```

### requirements.txt
```
pdfplumber>=0.10.0
openpyxl>=3.1.0
tqdm>=4.65.0
```

---

## How to Run

### Basic usage
```bash
python parsing_script.py --input ./invoices --output ./output/DRT_Invoices.xlsx
```

### With JSON debug log
```bash
python parsing_script.py --input ./invoices --output ./output/DRT_Invoices.xlsx --log-json
```

### Arguments
| Argument | Short | Default | Description |
|----------|-------|---------|-------------|
| `--input` | `-i` | required | Path to folder with PDFs (scanned recursively) |
| `--output` | `-o` | `./output/DRT_Invoices.xlsx` | Output Excel path |
| `--log-json` | — | false | Save raw extracted data as JSON for debugging |

---

## Excel Output Structure

### Sheet 1 — Invoice Summary
One row per invoice. All invoice fields are columns (horizontal layout).

**Column Groups:**
- Invoice Info: Invoice #, Invoice Date, Shipment Date, Delivery Date, Payment Term
- Reference Numbers: BOL, S.O., P.O., Carrier Pro Number
- Carrier Info: SCAC, Carrier Name
- Bill To / Shipper / Consignee: name + full address each
- Freight Summary: Total Pallets, Pieces, Weight
- Charges: Freight, Fuel, Discount, Lumper, Inspection, Total Amount
- Meta: Source File, Parse Error

### Sheet 2 — Line Item Detail
One row per freight line item. Invoice fields repeated on each row for easy pivot/filter.

**Columns:** Invoice #, S.O. Number, Invoice Date, Carrier, Consignee Address, Line #, Description, Class, Pallets, Pieces, Weight, Charges, Source File

### Sheet 3 — Analysis Dashboard
- 6 KPI cards: Total Invoices, Total Amount, Total Weight, Total Pieces, Total Pallets, Avg Invoice
- Per-invoice charge table: Freight, Fuel, Discount, Lumper, Inspection, Total, % of Grand Total

---

## How Parsing Works

### Step 1 — Text Extraction
`pdfplumber` opens each PDF and extracts raw text page by page. Multi-page PDFs are concatenated.

### Step 2 — Regex Field Matching
Each field uses a targeted regex pattern. For example:
```python
"invoice_number": r"Invoice\s+Number[:\s]+([A-Z0-9]+)"
"total_amount":   r"Amount[\s\$]+([\d,]+\.\d{2})"
"freight_charge": r"Freight\s+([\d,]+\.\d{2})"
```

### Step 3 — Line Item Table Parsing
The script scans for the `Charges Detail` table header, then reads each line matching the pattern:
`<description> <class> <pallets> <pieces> <weight> [charges]`

### Step 4 — Address Block Extraction
Multi-line address blocks are captured by finding the keyword (`Bill To`, `Shipper`, `Consignee`) and reading the following lines.

### Step 5 — Error Handling
Parse errors are caught per-file and written into the `Parse Error` column in the Excel output. The script continues processing remaining files even if one fails.

---

## Extending for New Invoice Formats

If DRT changes their invoice layout, update the regex patterns in `FIELD_PATTERNS` and `CHARGE_PATTERNS` at the top of `parsing_script.py`.

To add a new field:
1. Add it to `FIELD_PATTERNS` dict with its regex
2. Add it to the `result` dict in `parse_pdf()`
3. Add it to `field_map` in `build_summary_sheet()`
4. Add a column width entry

---

## Known Limitations

| Limitation | Workaround |
|------------|------------|
| Scanned image PDFs (not text-based) | Run OCR first using `pytesseract` or Adobe Acrobat |
| PDFs with non-standard layouts | Update regex patterns or add a format-specific parser branch |
| Line item charges sometimes blank in PDF | Captured as empty string; totals from summary line are used |
| Very large batches (10,000+ PDFs) | Consider chunking and appending to existing Excel, or use a database |

---

## Performance

| Invoices | Approx. Time |
|----------|-------------|
| 100 PDFs | ~30 seconds |
| 1,000 PDFs | ~5 minutes |
| 10,000 PDFs | ~45-60 minutes |

For large batches, run with `--log-json` to save intermediate results and resume if interrupted.

---

*Generated: April 2026 | DRT Transportation Invoice Automation Project*
