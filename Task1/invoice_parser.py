#!/usr/bin/env python3
"""
invoice_parser.py  —  v4.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Batch-parse DRT Transportation invoice PDFs → Excel workbook.

Usage:
    python invoice_parser.py                   # scans current folder
    python invoice_parser.py ./invoices        # specific folder
    python invoice_parser.py "file.pdf"        # single file

Output:  invoice_data_output.xlsx

Requirements:
    pip install pdfplumber openpyxl
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW TO ADD / REMOVE FIELDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All field configuration lives in two places:

  1. SUMMARY_GROUPS  (below) — controls Invoice Summary sheet columns.
     Each entry: ('Column Header', 'record_key', col_width, 'num_fmt', alignment)
     • To REMOVE a field: delete or comment out its line.
     • To ADD a field:    add a new line with a new record_key,
                          then extract it in parse_invoice().

  2. LINE_ITEM_COLUMNS (below) — controls Line Items sheet columns.
     Each entry: ('Column Header', 'item_key_or_record_key', width, fmt, align, source)
     source = 'item'   → value comes from the line-item dict
     source = 'record' → value comes from the parent invoice record
     • To REMOVE a column: delete or comment out its line.
     • To ADD a column:    add a new line.

  Auto-detect: any key found in parsed records that is NOT listed in
  SUMMARY_GROUPS will be appended automatically as a new column in an
  "Extra Fields" section so nothing is ever silently dropped.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import os, re, sys, glob
from datetime import datetime

import pdfplumber
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo


# ══════════════════════════════════════════════════════════════
#  ❶  FIELD CONFIGURATION  — edit here to add / remove columns
# ══════════════════════════════════════════════════════════════

CTR = Alignment(horizontal="center", vertical="center")
LFT = Alignment(horizontal="left", vertical="center", indent=1)
RGT = Alignment(horizontal="right", vertical="center")

SUMMARY_GROUPS = [
    (
        "Invoice Info",
        [
            ("Source File", "source_file", 22, "@", LFT),
            ("Invoice #", "invoice_number", 12, "@", CTR),
            ("Invoice Date", "invoice_date", 12, "@", CTR),
            ("Shipment Date", "shipment_date", 12, "@", CTR),
            ("Delivery Date", "delivery_date", 12, "@", CTR),
            ("Payment Term", "payment_term", 12, "@", CTR),
        ],
    ),
    (
        "Reference Numbers",
        [
            ("BOL Number", "bol_number", 14, "@", CTR),
            ("S.O. Number", "so_number", 14, "@", CTR),
            ("P.O. Number", "po_number", 26, "@", LFT),
            ("Carrier PRO #", "carrier_pro_number", 18, "@", CTR),
        ],
    ),
    (
        "Carrier",
        [
            ("SCAC", "scac", 6, "@", CTR),
            ("Carrier Name", "carrier", 30, "@", LFT),
        ],
    ),
    (
        "Bill To",
        [
            ("Bill To Name", "bill_to_name", 22, "@", LFT),
            ("Bill To Addr", "bill_to_address", 36, "@", LFT),
        ],
    ),
    (
        "Shipper",
        [
            ("Shipper Name", "shipper_name", 22, "@", LFT),
            ("Shipper Addr", "shipper_address", 36, "@", LFT),
        ],
    ),
    (
        "Consignee",
        [
            ("Consignee Name", "consignee_name", 22, "@", LFT),
            ("Consignee Addr", "consignee_address", 36, "@", LFT),
        ],
    ),
    (
        "Freight Totals",
        [
            ("Pallets", "total_pallets", 8, "#,##0", CTR),
            ("Pieces", "total_pieces", 8, "#,##0", CTR),
            ("Weight (lbs)", "total_weight", 12, "#,##0", RGT),
        ],
    ),
    (
        "Charges ($)",
        [
            ("Freight", "freight_charge", 13, "#,##0.00", RGT),
            ("Fuel", "fuel_charge", 11, "#,##0.00", RGT),
            ("Discount", "discount", 13, "#,##0.00", RGT),
            ("Lumper", "lumper", 11, "#,##0.00", RGT),
            ("Inspection", "inspection_charge", 12, "#,##0.00", RGT),
            ("TOTAL AMOUNT", "total_amount", 15, "#,##0.00", RGT),
        ],
    ),
    (
        "Status",
        [
            ("Parse Error", "parse_error", 20, "@", LFT),
        ],
    ),
]

LINE_ITEM_COLUMNS = [
    ("Invoice #", "invoice_number", 12, "@", CTR, "record"),
    ("Line #", "_line_num", 7, "#,##0", CTR, "item"),
    ("Description", "description", 55, "@", LFT, "item"),
    ("Class", "class", 8, "#,##0", CTR, "item"),
    ("Pallets", "pallets", 8, "#,##0", CTR, "item"),
    ("Pieces", "pieces", 8, "#,##0", CTR, "item"),
    ("Weight (lbs)", "weight", 12, "#,##0", RGT, "item"),
]

SECTION_FILLS = {
    "Invoice Info": "1F3864",
    "Reference Numbers": "243F60",
    "Carrier": "2E547A",
    "Bill To": "17375E",
    "Shipper": "1F4E79",
    "Consignee": "2F5597",
    "Freight Totals": "375623",
    "Charges ($)": "7B2C2C",
    "Status": "595959",
    "Extra Fields": "4A4A4A",
}

NUMERIC_SUMMARY_KEYS = {
    "total_pallets": "#,##0",
    "total_pieces": "#,##0",
    "total_weight": "#,##0",
    "freight_charge": "#,##0.00",
    "fuel_charge": "#,##0.00",
    "discount": "#,##0.00",
    "lumper": "#,##0.00",
    "inspection_charge": "#,##0.00",
    "total_amount": "#,##0.00",
}


# ══════════════════════════════════════════════════════════════
#  ❷  UTILITY HELPERS
# ══════════════════════════════════════════════════════════════


def sci_to_plain(s):
    s = str(s).strip()
    m = re.match(r"^(\d+)\.(\d{0,20})[eE]\+0*(\d+)$", s)
    if not m:
        return s
    int_p, dec_p, exp = m.group(1), m.group(2), int(m.group(3))
    digits = int_p + dec_p
    total = len(int_p) + exp
    result = (
        (digits + "0" * (total - len(digits)))
        if total >= len(digits)
        else digits[:total]
    )
    return result.lstrip("0") or "0"


def clean_float(val):
    try:
        return float(str(val).replace(",", "").replace("$", "").replace(" ", ""))
    except:
        return 0.0


def clean_int(val):
    try:
        return int(str(val).replace(",", "").replace(" ", ""))
    except:
        return 0


def dedup_words(words, x_tol=2, y_tol=2):
    seen, out = set(), []
    for w in words:
        k = (round(w["x0"] / x_tol) * x_tol, round(w["top"] / y_tol) * y_tol, w["text"])
        if k not in seen:
            seen.add(k)
            out.append(w)
    return out


def words_to_line(wlist):
    return " ".join(w["text"] for w in sorted(wlist, key=lambda x: x["x0"]))


def group_into_lines(words, y_tol=4):
    if not words:
        return []
    sw = sorted(words, key=lambda w: w["top"])
    groups, cur = [], [sw[0]]
    for w in sw[1:]:
        if abs(w["top"] - cur[-1]["top"]) <= y_tol:
            cur.append(w)
        else:
            groups.append(
                (sum(x["top"] for x in cur) / len(cur), words_to_line(cur), cur)
            )
            cur = [w]
    groups.append((sum(x["top"] for x in cur) / len(cur), words_to_line(cur), cur))
    return groups


def value_next_line(lines, label_re):
    for i, (_, text, _) in enumerate(lines):
        if re.search(label_re, text, re.IGNORECASE) and i + 1 < len(lines):
            return lines[i + 1][1].strip()
    return ""


def value_same_line_right(lines, label_re, min_x=480):
    for _, text, wlist in lines:
        if re.search(label_re, text, re.IGNORECASE):
            v = [w for w in wlist if w["x0"] > min_x]
            if v:
                return " ".join(w["text"] for w in sorted(v, key=lambda x: x["x0"]))
    return ""


# ══════════════════════════════════════════════════════════════
#  ❸  LINE ITEM PARSER
# ══════════════════════════════════════════════════════════════


def _parse_line_items(words):
    """
    Anchor-based parser v4.0:
    - Descriptions include the NMFC: label if present (e.g. "Goods NMFC:")
    - Stops before the numeric NMFC code that follows NMFC:
    - Handles 1-line and multi-line descriptions
    """
    DESC_X = (14, 160)
    CLASS_X = (160, 205)
    PAL_X = (205, 245)
    PCS_X = (240, 292)
    WGT_X = (285, 350)
    CHARGE_LABELS = {"Freight", "Fuel", "Discount", "Lumper", "INSPECTION"}
    SKIP_HDR = {
        "Description",
        "Class",
        "Pallets",
        "Piece",
        "Weight",
        "Charges",
        "Detail",
    }

    def in_band(w, x0, x1):
        return x0 <= w["x0"] < x1

    sw = sorted(words, key=lambda w: w["top"])

    t_start = t_end = None
    for w in sw:
        if w["text"] == "Detail" and t_start is None:
            t_start = w["top"] + 8
        if w["text"] == "Total" and t_start and t_end is None:
            t_end = w["top"] - 2
    if not t_start:
        return []

    tw = [
        w
        for w in sw
        if t_start < w["top"] < (t_end or 9999)
        and w["text"] not in SKIP_HDR
        and w["text"] not in CHARGE_LABELS
    ]

    row_map = {}
    for w in tw:
        k = round(w["top"] / 4) * 4
        row_map.setdefault(k, []).append(w)

    anchors = []
    for rk in sorted(row_map):
        row = row_map[rk]
        if any(
            in_band(w, *CLASS_X)
            or in_band(w, *PAL_X)
            or in_band(w, *PCS_X)
            or in_band(w, *WGT_X)
            for w in row
        ):
            anchors.append(rk)

    if not anchors:
        return []

    items = []
    for idx, anchor_top in enumerate(anchors):
        next_top = anchors[idx + 1] if idx + 1 < len(anchors) else (t_end or 9999)
        arow = row_map[anchor_top]

        def pick(x0, x1):
            v = [w["text"] for w in arow if in_band(w, x0, x1)]
            return v[0] if v else ""

        # ── DESCRIPTION COLLECTION ──────────────────────────────────────
        # Collect all DESC-band words from this anchor to the next.
        # Rules:
        #   • "NMFC:" token → include it in the description, then STOP.
        #     (The numeric code that follows NMFC: is excluded.)
        #   • Any other token past the NMFC: label → excluded.
        # ────────────────────────────────────────────────────────────────
        desc_words = []
        nmfc_seen = False
        for w in sorted(tw, key=lambda x: (x["top"], x["x0"])):
            rk = round(w["top"] / 4) * 4
            if rk < anchor_top:
                continue
            if rk >= next_top:
                break
            if not in_band(w, *DESC_X):
                continue
            if nmfc_seen:
                break  # stop at anything after NMFC:
            if w["text"].startswith("NMFC"):
                desc_words.append(w["text"])  # include "NMFC:" label
                nmfc_seen = True
                continue
            desc_words.append(w["text"])

        desc = " ".join(desc_words).strip()
        if not desc and not pick(*CLASS_X):
            continue

        items.append(
            {
                "description": desc,
                "class": clean_int(pick(*CLASS_X)),
                "pallets": clean_int(pick(*PAL_X)),
                "pieces": clean_int(pick(*PCS_X)),
                "weight": clean_int(pick(*WGT_X)),
            }
        )

    return items


# ══════════════════════════════════════════════════════════════
#  ❹  INVOICE PDF PARSER
# ══════════════════════════════════════════════════════════════

_KNOWN_KEYS = {
    "source_file",
    "invoice_number",
    "invoice_date",
    "shipment_date",
    "delivery_date",
    "payment_term",
    "bol_number",
    "so_number",
    "po_number",
    "carrier_pro_number",
    "scac",
    "carrier",
    "bill_to_name",
    "bill_to_address",
    "shipper_name",
    "shipper_address",
    "consignee_name",
    "consignee_address",
    "total_pallets",
    "total_pieces",
    "total_weight",
    "freight_charge",
    "fuel_charge",
    "discount",
    "lumper",
    "inspection_charge",
    "total_amount",
    "line_items",
    "parse_error",
}


def parse_invoice(pdf_path):
    rec = {
        "source_file": os.path.basename(pdf_path),
        "invoice_number": "",
        "invoice_date": "",
        "shipment_date": "",
        "delivery_date": "",
        "payment_term": "",
        "bol_number": "",
        "so_number": "",
        "po_number": "",
        "carrier_pro_number": "",
        "scac": "",
        "carrier": "",
        "bill_to_name": "",
        "bill_to_address": "",
        "shipper_name": "",
        "shipper_address": "",
        "consignee_name": "",
        "consignee_address": "",
        "total_pallets": 0,
        "total_pieces": 0,
        "total_weight": 0,
        "freight_charge": 0.0,
        "fuel_charge": 0.0,
        "discount": 0.0,
        "lumper": 0.0,
        "inspection_charge": 0.0,
        "total_amount": 0.0,
        "line_items": [],
        "parse_error": "",
    }

    try:
        with pdfplumber.open(pdf_path) as pdf:
            raw_all, raw_p1 = [], list(pdf.pages[0].extract_words())
            for pg in pdf.pages:
                raw_all.extend(pg.extract_words())

        all_words = dedup_words(raw_all)
        page1_words = dedup_words(raw_p1)

        p1_top = [w for w in page1_words if w["top"] < 560]
        p1_right = [w for w in p1_top if w["x0"] >= 350]
        p1_left = [w for w in p1_top if w["x0"] < 350]

        right_lines = group_into_lines(p1_right)
        left_lines = group_into_lines(p1_left)

        inv_w = [w for w in p1_right if 60 < w["top"] < 80 and w["x0"] < 480]
        if inv_w:
            rec["invoice_number"] = " ".join(
                w["text"] for w in sorted(inv_w, key=lambda x: x["x0"])
            )

        amt_w = [w for w in p1_right if 60 < w["top"] < 80 and w["x0"] >= 480]
        if amt_w:
            rec["total_amount"] = clean_float(
                " ".join(w["text"] for w in sorted(amt_w, key=lambda x: x["x0"]))
            )

        rec["shipment_date"] = value_same_line_right(right_lines, r"Shipment\s+Date")
        rec["delivery_date"] = value_same_line_right(right_lines, r"Delivery\s+Date")
        rec["payment_term"] = value_same_line_right(right_lines, r"Payment\s+Term")
        rec["invoice_date"] = value_same_line_right(right_lines, r"Invoice\s+Date")

        rec["bol_number"] = value_next_line(right_lines, r"BOL\s+Number")
        rec["so_number"] = value_next_line(right_lines, r"S\.O\.\s+Number")
        rec["po_number"] = value_next_line(right_lines, r"P\.O\.\s+Number")
        rec["scac"] = value_next_line(right_lines, r"SCAC:")
        rec["carrier"] = value_next_line(right_lines, r"Carrier:")
        rec["carrier_pro_number"] = sci_to_plain(
            value_next_line(right_lines, r"Carrier\s+Pro\s+Number")
        )

        bt_w = [w for w in p1_left if 85 < w["top"] < 175]
        bt_l = [
            t
            for _, t, _ in group_into_lines(bt_w)
            if not re.match(r"Bill\s+To:", t, re.I)
        ]
        rec["bill_to_name"] = bt_l[0] if bt_l else ""
        rec["bill_to_address"] = ", ".join(bt_l[1:]) if len(bt_l) > 1 else ""

        sh_w = [w for w in p1_left if 183 < w["top"] < 260 and w["x0"] < 200]
        sh_l = [
            t
            for _, t, _ in group_into_lines(sh_w)
            if not re.match(r"Shipper:", t, re.I)
        ]
        rec["shipper_name"] = sh_l[0] if sh_l else ""
        rec["shipper_address"] = ", ".join(sh_l[1:]) if len(sh_l) > 1 else ""

        cn_w = [w for w in p1_top if 210 <= w["x0"] < 345 and 183 < w["top"] < 260]
        cn_l = [
            t
            for _, t, _ in group_into_lines(cn_w)
            if not re.match(r"Consignee:", t, re.I)
        ]
        rec["consignee_name"] = cn_l[0] if cn_l else ""
        rec["consignee_address"] = ", ".join(cn_l[1:]) if len(cn_l) > 1 else ""

        CHARGE_MAP = {
            r"^Freight$": "freight_charge",
            r"^Fuel$": "fuel_charge",
            r"^Discount$": "discount",
            r"^Lumper$": "lumper",
            r"INSPECTION": "inspection_charge",
        }
        lbl_words = [w for w in all_words if w["x0"] < 100]
        val_words = [w for w in all_words if w["x0"] > 200]
        for lw in lbl_words:
            for pattern, field in CHARGE_MAP.items():
                if re.match(pattern, lw["text"], re.IGNORECASE):
                    m = [v for v in val_words if abs(v["top"] - lw["top"]) <= 5]
                    if m:
                        v = clean_float(
                            min(m, key=lambda x: abs(x["top"] - lw["top"]))["text"]
                        )
                        rec[field] = -abs(v) if field == "discount" and v else v
                    break

        total_word = next(
            (
                w
                for w in all_words
                if w["text"] == "Total" and w["x0"] < 100 and w["top"] > 300
            ),
            None,
        )
        if total_word:
            t_top = total_word["top"]
            row_w = [
                w for w in all_words if abs(w["top"] - t_top) < 8 and w["x0"] > 100
            ]
            by_x = {round(w["x0"]): w["text"] for w in row_w}

            def pick_x(x0, x1):
                for k, v in sorted(by_x.items()):
                    if x0 <= k <= x1:
                        return v
                return "0"

            rec["total_pallets"] = clean_int(pick_x(200, 240))
            rec["total_pieces"] = clean_int(pick_x(240, 292))
            rec["total_weight"] = clean_int(pick_x(292, 345))
            cands = [clean_float(v) for k, v in by_x.items() if k >= 345]
            if cands:
                rec["total_amount"] = max(cands)

        rec["line_items"] = _parse_line_items(page1_words)

    except Exception as exc:
        rec["parse_error"] = str(exc)

    return rec


# ══════════════════════════════════════════════════════════════
#  ❺  STYLE CONSTANTS
# ══════════════════════════════════════════════════════════════


def _fill(hex6):
    return PatternFill("solid", fgColor=hex6)


def _border(t=None, b=None, l=None, r=None):
    return Border(
        top=t or Side(style=None),
        bottom=b or Side(style=None),
        left=l or Side(style=None),
        right=r or Side(style=None),
    )


HDR_FONT = Font(name="Calibri", bold=True, color="FFFFFF", size=10)
TITLE_FONT = Font(name="Calibri", bold=True, color="1F3864", size=14)
SUB_FONT = Font(name="Calibri", italic=True, color="595959", size=10)
BODY_FONT = Font(name="Calibri", size=10)
TOTAL_FONT = Font(name="Calibri", bold=True, size=10)
TOTAL_FILL = _fill("D9E1F2")
ERR_FILL = _fill("FFE0E0")
ALT_FILL = _fill("F2F2F2")
HDR_FILL = _fill("1F3864")
THIN_SIDE = Side(style="thin", color="E8E8E8")
MED_SIDE = Side(style="medium", color="1F3864")


def _write_header_row(ws, row, col_defs, fill_hex="1F3864"):
    hf = _fill(fill_hex)
    for ci, (lbl, _, width, *_rest) in enumerate(col_defs, start=1):
        c = ws.cell(row=row, column=ci, value=lbl)
        c.font = HDR_FONT
        c.fill = hf
        c.alignment = CTR
        c.border = _border(b=MED_SIDE)
        ws.column_dimensions[get_column_letter(ci)].width = width
    ws.row_dimensions[row].height = 22


# ══════════════════════════════════════════════════════════════
#  ❻  COLLECT EXTRA FIELDS
# ══════════════════════════════════════════════════════════════


def _extra_fields(records):
    declared = {key for _, fields in SUMMARY_GROUPS for _, key, *_ in fields}
    extra = []
    for rec in records:
        for k in rec:
            if k not in declared and k not in ("line_items",) and k not in extra:
                extra.append(k)
    return extra


# ══════════════════════════════════════════════════════════════
#  ❼  SHEET 1 — INVOICE SUMMARY
# ══════════════════════════════════════════════════════════════


def write_summary_sheet(wb, records):
    ws = wb.active
    ws.title = "Invoice Summary"
    ws.sheet_view.showGridLines = False
    ws.freeze_panes = "B6"
    ws.column_dimensions["A"].width = 3

    extra_keys = _extra_fields(records)
    effective_groups = list(SUMMARY_GROUPS)
    if extra_keys:
        extra_cols = [
            (k.replace("_", " ").title(), k, 18, "@", LFT) for k in extra_keys
        ]
        effective_groups.append(("Extra Fields", extra_cols))

    col_defs = [
        (lbl, key, nf, aln)
        for _, fields in effective_groups
        for lbl, key, _, nf, aln in fields
    ]

    total_cols = len(col_defs)
    last_col_letter = get_column_letter(total_cols + 1)

    ws.row_dimensions[1].height = 8
    ws.row_dimensions[2].height = 30
    ws.row_dimensions[3].height = 16
    ws.row_dimensions[4].height = 20
    ws.row_dimensions[5].height = 26

    t = ws.cell(row=2, column=2, value="DRT Transportation — Invoice Data")
    t.font = TITLE_FONT
    t.alignment = LFT
    ws.merge_cells(f"B2:{last_col_letter}2")

    s = ws.cell(
        row=3,
        column=2,
        value=f'Extracted {len(records)} invoice(s)  |  Generated: {datetime.now().strftime("%d %b %Y  %H:%M")}',
    )
    s.font = SUB_FONT
    s.alignment = LFT
    ws.merge_cells(f"B3:{last_col_letter}3")

    col_cur = 2
    for section, fields in effective_groups:
        hex6 = SECTION_FILLS.get(section, "4A4A4A")
        sc = ws.cell(row=4, column=col_cur, value=section)
        sc.font = Font(name="Calibri", bold=True, color="FFFFFF", size=9)
        sc.fill = _fill(hex6)
        sc.alignment = CTR
        if len(fields) > 1:
            ws.merge_cells(
                start_row=4,
                start_column=col_cur,
                end_row=4,
                end_column=col_cur + len(fields) - 1,
            )
        col_cur += len(fields)

    col_cur = 2
    for section, fields in effective_groups:
        for lbl, key, width, nf, aln in fields:
            hc = ws.cell(row=5, column=col_cur, value=lbl)
            hc.font = HDR_FONT
            hc.fill = HDR_FILL
            hc.alignment = CTR
            hc.border = _border(b=MED_SIDE)
            ws.column_dimensions[get_column_letter(col_cur)].width = width
            col_cur += 1

    for ri, rec in enumerate(records):
        er = 6 + ri
        fill = ALT_FILL if ri % 2 == 0 else None
        col_cur = 2
        for lbl, key, nf, aln in col_defs:
            val = rec.get(key, "")
            c = ws.cell(row=er, column=col_cur, value=val)
            c.font = BODY_FONT
            c.alignment = aln
            c.number_format = nf
            c.border = _border(b=THIN_SIDE)
            if rec.get("parse_error"):
                c.fill = ERR_FILL
            elif fill:
                c.fill = fill
            col_cur += 1
        ws.row_dimensions[er].height = 16

    tr = 6 + len(records)
    ws.cell(row=tr, column=2, value="TOTALS").font = TOTAL_FONT
    ws.cell(row=tr, column=2).fill = TOTAL_FILL
    ws.cell(row=tr, column=2).alignment = CTR

    col_cur = 2
    for lbl, key, nf, aln in col_defs:
        c = ws.cell(row=tr, column=col_cur)
        if key in NUMERIC_SUMMARY_KEYS:
            cl = get_column_letter(col_cur)
            c.value = f"=SUM({cl}6:{cl}{tr-1})"
            c.font = TOTAL_FONT
            c.alignment = RGT
            c.number_format = NUMERIC_SUMMARY_KEYS[key]
            c.border = _border(t=MED_SIDE, b=MED_SIDE)
        c.fill = TOTAL_FILL
        col_cur += 1
    ws.row_dimensions[tr].height = 18


# ══════════════════════════════════════════════════════════════
#  ❽  SHEET 2 — LINE ITEMS
# ══════════════════════════════════════════════════════════════


def write_line_items_sheet(wb, records):
    ws = wb.create_sheet("Listed Items")

    # Header row
    for c, col in enumerate(LINE_ITEM_COLUMNS, start=1):
        cell = ws.cell(row=1, column=c, value=col[0])
        cell.fill = HDR_FILL
        cell.font = HDR_FONT
        cell.alignment = CTR
        cell.border = _border(b=THIN_SIDE)

        ws.column_dimensions[get_column_letter(c)].width = col[2]

    current_row = 2

    for rec in records:
        items = rec.get("line_items", [])
        start_row = current_row

        for i, item in enumerate(items, start=1):
            item["_line_num"] = i

            for c, col in enumerate(LINE_ITEM_COLUMNS, start=1):
                key = col[1]
                source = col[5]

                # skip invoice id (we merge later)
                if key == "invoice_number":
                    continue

                value = item.get(key, "") if source == "item" else rec.get(key, "")

                cell = ws.cell(row=current_row, column=c, value=value)
                cell.border = _border(b=THIN_SIDE)
                cell.alignment = col[4]

                if current_row % 2 == 0:
                    cell.fill = ALT_FILL

            current_row += 1

        end_row = current_row - 1

        # ✅ Merge invoice column
        if end_row >= start_row:
            ws.merge_cells(
                start_row=start_row, start_column=1, end_row=end_row, end_column=1
            )

            merged_cell = ws.cell(row=start_row, column=1)
            merged_cell.value = rec.get("invoice_number", "")
            merged_cell.alignment = CTR
            merged_cell.border = _border(b=THIN_SIDE)

    # ✅ Add filters WITHOUT table (this keeps merges working)
    if current_row > 2:
        ws.auto_filter.ref = (
            f"A1:{get_column_letter(len(LINE_ITEM_COLUMNS))}{current_row - 1}"
        )


# ══════════════════════════════════════════════════════════════
#  ❾  SHEET 3 — ANALYSIS DASHBOARD
# ══════════════════════════════════════════════════════════════


def write_analysis_sheet(wb, records):
    ws = wb.create_sheet("Analysis Dashboard")
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 3

    n = len(records)

    col_map = {}
    col_cur = 2
    for _, fields in SUMMARY_GROUPS:
        for _, key, *_ in fields:
            col_map[key] = get_column_letter(col_cur)
            col_cur += 1

    def sref(key, r1=6, r2=5 + n):
        cl = col_map.get(key)
        return f"'Invoice Summary'!{cl}{r1}:{cl}{r2}" if cl else None

    def kpi(row, col, label, val, fmt="#,##0.00", bg="1F3864"):
        lc = ws.cell(row=row, column=col, value=label)
        vc = ws.cell(row=row + 1, column=col, value=val)
        lc.font = Font(name="Calibri", bold=True, color="FFFFFF", size=10)
        lc.fill = _fill(bg)
        lc.alignment = CTR
        vc.font = Font(name="Calibri", bold=True, color="1F3864", size=13)
        vc.fill = _fill("EEF2FF")
        vc.alignment = CTR
        vc.number_format = fmt
        ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + 2)
        ws.merge_cells(
            start_row=row + 1, start_column=col, end_row=row + 1, end_column=col + 2
        )
        ws.row_dimensions[row].height = 18
        ws.row_dimensions[row + 1].height = 34

    ws.row_dimensions[1].height = 8
    ws.row_dimensions[2].height = 28
    tc = ws.cell(row=2, column=2, value="Analysis Dashboard")
    tc.font = TITLE_FONT
    tc.alignment = LFT
    ws.merge_cells("B2:U2")
    ws.row_dimensions[3].height = 12

    kpi(4, 2, "# Invoices", n, "#,##0", "1F3864")
    kpi(4, 6, "Total Amount ($)", f'=SUM({sref("total_amount")})', "#,##0.00", "17375E")
    kpi(
        4,
        10,
        "Avg Invoice ($)",
        f'=IFERROR(AVERAGE({sref("total_amount")}),0)',
        "#,##0.00",
        "2E547A",
    )
    kpi(4, 14, "Total Weight (lbs)", f'=SUM({sref("total_weight")})', "#,##0", "375623")
    kpi(4, 18, "Total Pieces", f'=SUM({sref("total_pieces")})', "#,##0", "7B2C2C")
    ws.row_dimensions[6].height = 14

    ws.cell(row=7, column=2, value="Per-Invoice Charge Breakdown").font = Font(
        name="Calibri", bold=True, size=12, color="1F3864"
    )
    ws.cell(row=7, column=2).alignment = LFT
    ws.merge_cells("B7:J7")
    ws.row_dimensions[7].height = 22

    COLS2 = [
        ("Invoice #", "invoice_number", 12, "@", CTR),
        ("S.O. Number", "so_number", 14, "@", CTR),
        ("Consignee Addr", "consignee_address", 30, "@", LFT),
        ("Freight ($)", "freight_charge", 13, "#,##0.00", RGT),
        ("Fuel ($)", "fuel_charge", 12, "#,##0.00", RGT),
        ("Discount ($)", "discount", 13, "#,##0.00", RGT),
        ("Lumper ($)", "lumper", 12, "#,##0.00", RGT),
        ("Total Amount ($)", "total_amount", 16, "#,##0.00", RGT),
        ("% of Grand Total", "_pct", 15, "0.0%", CTR),
    ]

    for ci, (lbl, _, wid, *_r) in enumerate(COLS2, start=2):
        c = ws.cell(row=8, column=ci, value=lbl)
        c.font = HDR_FONT
        c.fill = _fill("243F60")
        c.alignment = CTR
        c.border = _border(b=MED_SIDE)
        ws.column_dimensions[get_column_letter(ci)].width = wid
    ws.row_dimensions[8].height = 20

    grand = sref("total_amount")
    for ri, rec in enumerate(records):
        er = 9 + ri
        sr = 6 + ri
        fill = ALT_FILL if ri % 2 == 0 else None
        sn = "Invoice Summary"

        row_vals = []
        for lbl, key, _, nf, aln in COLS2:
            if key == "_pct":
                cl = col_map.get("total_amount")
                v = f"=IFERROR('{sn}'!{cl}{sr}/SUM({grand}),0)"
            elif key == "consignee_address":
                v = rec.get("consignee_address", "")
            else:
                cl = col_map.get(key)
                v = f"='{sn}'!{cl}{sr}" if cl else ""
            row_vals.append((v, nf, aln))

        for ci, (val, nf, aln) in enumerate(row_vals, start=2):
            c = ws.cell(row=er, column=ci, value=val)
            c.font = BODY_FONT
            c.alignment = aln
            c.number_format = nf
            c.border = _border(b=THIN_SIDE)
            if fill:
                c.fill = fill
        ws.row_dimensions[er].height = 15

    tr = 9 + n
    ws.cell(row=tr, column=2, value="TOTAL").font = TOTAL_FONT
    ws.cell(row=tr, column=2).fill = TOTAL_FILL
    ws.cell(row=tr, column=2).alignment = CTR
    for ci, (_, key, _, nf, _) in enumerate(COLS2, start=2):
        c = ws.cell(row=tr, column=ci)
        ref = sref(key)
        if ref and key not in (
            "_pct",
            "invoice_number",
            "so_number",
            "consignee_address",
        ):
            c.value = f"=SUM({ref})"
        c.font = TOTAL_FONT
        c.fill = TOTAL_FILL
        c.alignment = RGT
        c.number_format = nf
        c.border = _border(t=MED_SIDE, b=MED_SIDE)
    ws.row_dimensions[tr].height = 18


# ══════════════════════════════════════════════════════════════
#  ❿  BUILD WORKBOOK + MAIN
# ══════════════════════════════════════════════════════════════


def build_workbook(records, out_path):
    wb = Workbook()
    write_summary_sheet(wb, records)
    write_line_items_sheet(wb, records)
    write_analysis_sheet(wb, records)
    wb.save(out_path)
    print(f"\n✅  Saved → {out_path}")
    print(f"   Sheets : Invoice Summary | Line Items | Analysis Dashboard")
    print(f"   Records: {len(records)} invoice(s) parsed")
    errs = [r for r in records if r.get("parse_error")]
    if errs:
        print(f"   ⚠️  Parse errors in {len(errs)} file(s):")
        for e in errs:
            print(f'       {e["source_file"]}: {e["parse_error"]}')
    extra = _extra_fields(records)
    if extra:
        print(f"   🆕  Auto-detected new fields → added as extra columns: {extra}")


def main():
    if len(sys.argv) > 1:
        paths = []
        for arg in sys.argv[1:]:
            if os.path.isdir(arg):
                paths += sorted(
                    glob.glob(os.path.join(arg, "**", "*.pdf"), recursive=True)
                )
                paths += sorted(
                    glob.glob(os.path.join(arg, "**", "*.PDF"), recursive=True)
                )
            elif os.path.isfile(arg):
                paths.append(arg)
            else:
                paths += sorted(glob.glob(arg))
        if not paths:
            joined = " ".join(sys.argv[1:])
            if os.path.isfile(joined):
                paths.append(joined)
            elif os.path.isdir(joined):
                paths += sorted(
                    glob.glob(os.path.join(joined, "**", "*.pdf"), recursive=True)
                )
    else:
        paths = sorted(glob.glob("**/*.pdf", recursive=True))
        paths += sorted(glob.glob("**/*.PDF", recursive=True))

    seen, unique = set(), []
    for p in paths:
        ap = os.path.abspath(p)
        if ap not in seen:
            seen.add(ap)
            unique.append(p)
    paths = unique

    if not paths:
        print("❌  No PDF files found.")
        print("  Usage:")
        print("    python invoice_parser.py ./invoices/")
        print('    python invoice_parser.py "file.pdf"')
        sys.exit(1)

    print(f"📄  Found {len(paths)} PDF(s) — parsing...\n")
    records = []
    for i, path in enumerate(paths, 1):
        print(
            f"  [{i:>4}/{len(paths)}]  {os.path.basename(path):<45} ",
            end="",
            flush=True,
        )
        rec = parse_invoice(path)
        records.append(rec)
        if rec["parse_error"]:
            print(f'⚠️  ERROR: {rec["parse_error"]}')
        else:
            print(f'✅  {rec["invoice_number"]:<12}  ${rec["total_amount"]:>10,.2f}')

    build_workbook(records, "invoice_data_output.xlsx")


if __name__ == "__main__":
    main()
