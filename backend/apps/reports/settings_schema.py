SETTINGS_SCHEMA = [
    {
        "key": "reports.default_paper_format_id",
        "type": "integer",
        "default": None,
        "label": "Default Paper Format",
        "help": "ID of the default paper format used for generating PDFs.",
        "group": "Document Layout"
    },
    {
        "key": "reports.document_font",
        "type": "string",
        "default": "Helvetica",
        "label": "Document Font",
        "help": "Default font family for generated reports.",
        "group": "Document Layout"
    },
    {
        "key": "reports.company_header_html",
        "type": "text",
        "default": "",
        "label": "Company Header HTML",
        "help": "Global header applied to all reports.",
        "group": "Document Layout"
    },
    {
        "key": "reports.company_footer_html",
        "type": "text",
        "default": "",
        "label": "Company Footer HTML",
        "help": "Global footer applied to all reports.",
        "group": "Document Layout"
    }
]
