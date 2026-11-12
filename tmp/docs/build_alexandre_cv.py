from pathlib import Path

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(r"C:\Users\Frist\Documents\website\MarcoLadeiraWebsite")
OUT_DIR = ROOT / "output" / "doc"
DOWNLOAD_DIR = Path(r"D:\download2")

DOCX_PATH = OUT_DIR / "Alexandre_Ladeira_CV_2026_ATS.docx"
PDF_PATH = OUT_DIR / "Alexandre_Ladeira_CV_2026_ATS.pdf"
DOCX_COPY_PATH = DOWNLOAD_DIR / "Alexandre_Ladeira_CV_2026_ATS.docx"
PDF_COPY_PATH = DOWNLOAD_DIR / "Alexandre_Ladeira_CV_2026_ATS.pdf"


SUMMARY = (
    "Customer support and operations professional with 27+ years of experience across "
    "online payments, telecommunications and retail. Strong background in customer care, "
    "payment issues, disputes, claims, account limitations, fraud and risk review, and "
    "business account support within regulated environments. Known for calm problem-solving, "
    "relationship management and reliable service across phone, chat, email and face-to-face channels. "
    "Fluent in English and Portuguese."
)

CORE_SKILLS = (
    "Customer support and customer care, payments operations, disputes and claims, complaints and escalations, "
    "account limitations, fraud and risk investigations, business account support, GDPR and data privacy, "
    "AML/CIP awareness, relationship management, team leadership, staff training, KPI delivery, "
    "CRM and digital systems."
)

PAYPAL_BULLETS = [
    "Provided multi-channel customer support to consumer and business customers across voice, chat and email, resolving payment, account and technical issues in a high-volume environment.",
    "Investigated disputes, claims, account limitations, fraud and risk alerts, and compliance-related cases with strong attention to detail and policy adherence.",
    "Worked cross-functionally with internal teams to progress complex customer queries, reduce delays and improve resolution quality.",
    "Supported business accounts with high-priority service needs, balancing customer experience, commercial awareness and operational accuracy.",
    "Maintained accurate case documentation and handled sensitive customer data in line with GDPR and internal security standards.",
    "Managed multiple queues, changing priorities and SLA-driven workloads effectively in a remote, fast-paced setting.",
]

VODAFONE_MANAGER_BULLETS = [
    "Led day-to-day retail operations, coached team members, and drove performance against sales, service and revenue targets.",
    "Managed staffing, stock control, merchandising and inventory accuracy to keep operations efficient and customer-ready.",
    "Recruited, onboarded and trained new staff, strengthening product knowledge, service consistency and team confidence.",
    "Resolved customer concerns professionally while protecting brand standards and supporting repeat business.",
]

VODAFONE_ASSISTANT_BULLETS = [
    "Advised customers on handsets, plans and upgrades, matching products to needs and supporting strong sales performance.",
    "Delivered front-line customer service and after-sales support in a busy retail environment.",
    "Contributed to store targets through consultative selling, problem-solving and product knowledge.",
]

KFC_BULLETS = [
    "Delivered fast, accurate service in a high-volume environment while maintaining friendly customer care.",
]

TMN_BULLETS = [
    "Led floor sales activity, supported colleagues and maintained service and operating standards in a busy telecom retail environment.",
]

OPTIMUS_BULLETS = [
    "Sold mobile products and plans through product demonstrations, customer advice and target-focused service.",
]

ZON_BULLETS = [
    "Promoted telecom packages, supported customers and maintained accurate cash and record handling.",
]

WORTEN_BULLETS = [
    "Supported merchandising, stock accuracy and day-to-day store operations in a busy retail environment.",
]

EDUCATION = (
    "Administration and Commercial Studies, Escola Secundaria Francisco Fernandes Lopes, Portugal (1997)"
)

LANGUAGES = "Portuguese (native), English (fluent)"

ADDITIONAL_INFO = [
    "In-role training and experience in AML/CIP awareness, fraud prevention, disputes and claims handling, GDPR and secure data handling.",
    "Strong digital literacy across CRM tools, payment platforms, Microsoft Office and online support systems.",
    "Full Category B driving licence.",
]


def set_cell_margins(section):
    section.page_width = Mm(210)
    section.page_height = Mm(297)
    section.top_margin = Mm(14)
    section.bottom_margin = Mm(14)
    section.left_margin = Mm(15)
    section.right_margin = Mm(15)


def remove_extra_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    normal.font.size = Pt(10.5)

    for style_name in ["CV Name", "CV Contact", "CV Heading", "CV Subheading", "CV Bullet"]:
        if style_name in doc.styles:
            continue
        style_type = WD_STYLE_TYPE.PARAGRAPH
        style = doc.styles.add_style(style_name, style_type)
        style.base_style = normal
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")

    name_style = doc.styles["CV Name"]
    name_style.font.size = Pt(18)
    name_style.font.bold = True

    contact_style = doc.styles["CV Contact"]
    contact_style.font.size = Pt(10.5)

    heading_style = doc.styles["CV Heading"]
    heading_style.font.size = Pt(11.5)
    heading_style.font.bold = True

    subheading_style = doc.styles["CV Subheading"]
    subheading_style.font.size = Pt(10.8)
    subheading_style.font.bold = True

    bullet_style = doc.styles["CV Bullet"]
    bullet_style.font.size = Pt(10.2)


def add_paragraph_border(paragraph):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = p_pr.find(qn("w:pBdr"))
    if p_bdr is None:
        p_bdr = OxmlElement("w:pBdr")
        p_pr.append(p_bdr)
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "4")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "9CA3AF")
    p_bdr.append(bottom)


def add_heading(doc, text):
    p = doc.add_paragraph(style="CV Heading")
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text.upper())
    run.bold = True
    add_paragraph_border(p)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="CV Bullet")
    p.paragraph_format.left_indent = Mm(4.5)
    p.paragraph_format.first_line_indent = Mm(-2.2)
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.line_spacing = 1.0
    p.add_run("- ")
    p.add_run(text)
    return p


def add_role(doc, title_line, bullets):
    p = doc.add_paragraph(style="CV Subheading")
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    p.add_run(title_line).bold = True
    for bullet in bullets:
        add_bullet(doc, bullet)


def build_docx():
    doc = Document()
    section = doc.sections[0]
    set_cell_margins(section)
    remove_extra_styles(doc)

    name = doc.add_paragraph(style="CV Name")
    name.paragraph_format.space_after = Pt(2)
    name.add_run("Alexandre Miguel Martins Ladeira")

    contact = doc.add_paragraph(style="CV Contact")
    contact.paragraph_format.space_after = Pt(4)
    contact.add_run("Dundalk, Co. Louth | +353 87 194 3634 | ax.mladeirainbox@outlook.com")

    headline = doc.add_paragraph(style="CV Subheading")
    headline.paragraph_format.space_after = Pt(5)
    headline.add_run("Customer Support | Payments Operations | Complaints Resolution | Team Leadership")

    add_heading(doc, "Professional Summary")
    summary = doc.add_paragraph(style="Normal")
    summary.paragraph_format.space_after = Pt(3)
    summary.paragraph_format.line_spacing = 1.0
    summary.add_run(SUMMARY)

    add_heading(doc, "Core Skills")
    skills = doc.add_paragraph(style="Normal")
    skills.paragraph_format.space_after = Pt(3)
    skills.paragraph_format.line_spacing = 1.0
    skills.add_run(CORE_SKILLS)

    add_heading(doc, "Professional Experience")
    add_role(
        doc,
        "Senior Representative, Customer Care | PayPal | Dundalk, Ireland (Remote) | Jan 2020 - Apr 2026",
        PAYPAL_BULLETS,
    )
    add_role(
        doc,
        "Store Manager | Vodafone | Dundalk, Ireland | Aug 2015 - Jan 2020",
        VODAFONE_MANAGER_BULLETS,
    )
    add_role(
        doc,
        "Store Assistant | Vodafone | Dundalk / Ardee, Ireland | Sep 2012 - Aug 2015",
        VODAFONE_ASSISTANT_BULLETS,
    )
    add_role(
        doc,
        "Counter Staff | KFC | Dundalk, Ireland | Mar 2012 - Sep 2012",
        KFC_BULLETS,
    )
    add_role(
        doc,
        "Team Leader / Store Agent | TMN Mobile | Faro, Portugal | 2007 - 2012",
        TMN_BULLETS,
    )
    add_role(
        doc,
        "Store Sales Agent | Optimus Mobile | Faro, Portugal | 2006 - 2007",
        OPTIMUS_BULLETS,
    )
    add_role(
        doc,
        "Sales Assistant | ZON Cable TV and Broadband | Faro, Portugal | 2002 - 2006",
        ZON_BULLETS,
    )
    add_role(
        doc,
        "Shop Assistant | Worten | Faro, Portugal | 1998 - 2002",
        WORTEN_BULLETS,
    )

    add_heading(doc, "Education")
    education = doc.add_paragraph(style="Normal")
    education.paragraph_format.space_after = Pt(2)
    education.paragraph_format.line_spacing = 1.0
    education.add_run(EDUCATION)

    add_heading(doc, "Languages and Additional Information")
    languages = doc.add_paragraph(style="Normal")
    languages.paragraph_format.space_after = Pt(2)
    languages.paragraph_format.line_spacing = 1.0
    languages.add_run(f"Languages: {LANGUAGES}")

    for item in ADDITIONAL_INFO:
        add_bullet(doc, item)

    doc.save(DOCX_PATH)
    DOCX_COPY_PATH.write_bytes(DOCX_PATH.read_bytes())


def wrap_bullet(text, styles):
    return ListItem(
        Paragraph(text, styles["Body"]),
        leftIndent=0,
    )


def build_pdf():
    styles = {
        "Name": ParagraphStyle(
            "Name",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=21,
            spaceAfter=3,
            textColor=colors.black,
        ),
        "Contact": ParagraphStyle(
            "Contact",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica",
            fontSize=10.2,
            leading=12,
            spaceAfter=4,
        ),
        "Headline": ParagraphStyle(
            "Headline",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.9,
            leading=13,
            spaceAfter=5,
        ),
        "Section": ParagraphStyle(
            "Section",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11.2,
            leading=13,
            spaceBefore=6,
            spaceAfter=3,
            borderPadding=0,
            borderWidth=0.5,
            borderColor=colors.HexColor("#9CA3AF"),
            borderBottom=1,
        ),
        "Subheading": ParagraphStyle(
            "Subheading",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.6,
            leading=12,
            spaceBefore=3,
            spaceAfter=1,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=getSampleStyleSheet()["Normal"],
            fontName="Helvetica",
            fontSize=10.15,
            leading=12.2,
            alignment=TA_LEFT,
            spaceAfter=3,
        ),
    }

    story = [
        Paragraph("Alexandre Miguel Martins Ladeira", styles["Name"]),
        Paragraph("Dundalk, Co. Louth | +353 87 194 3634 | ax.mladeirainbox@outlook.com", styles["Contact"]),
        Paragraph("Customer Support | Payments Operations | Complaints Resolution | Team Leadership", styles["Headline"]),
        Paragraph("PROFESSIONAL SUMMARY", styles["Section"]),
        Paragraph(SUMMARY, styles["Body"]),
        Paragraph("CORE SKILLS", styles["Section"]),
        Paragraph(CORE_SKILLS, styles["Body"]),
        Paragraph("PROFESSIONAL EXPERIENCE", styles["Section"]),
        Paragraph(
            "Senior Representative, Customer Care | PayPal | Dundalk, Ireland (Remote) | Jan 2020 - Apr 2026",
            styles["Subheading"],
        ),
        ListFlowable([wrap_bullet(item, styles) for item in PAYPAL_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Store Manager | Vodafone | Dundalk, Ireland | Aug 2015 - Jan 2020", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in VODAFONE_MANAGER_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Store Assistant | Vodafone | Dundalk / Ardee, Ireland | Sep 2012 - Aug 2015", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in VODAFONE_ASSISTANT_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Counter Staff | KFC | Dundalk, Ireland | Mar 2012 - Sep 2012", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in KFC_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Team Leader / Store Agent | TMN Mobile | Faro, Portugal | 2007 - 2012", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in TMN_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Store Sales Agent | Optimus Mobile | Faro, Portugal | 2006 - 2007", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in OPTIMUS_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Sales Assistant | ZON Cable TV and Broadband | Faro, Portugal | 2002 - 2006", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in ZON_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("Shop Assistant | Worten | Faro, Portugal | 1998 - 2002", styles["Subheading"]),
        ListFlowable([wrap_bullet(item, styles) for item in WORTEN_BULLETS], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Paragraph("EDUCATION", styles["Section"]),
        Paragraph(EDUCATION, styles["Body"]),
        Paragraph("LANGUAGES AND ADDITIONAL INFORMATION", styles["Section"]),
        Paragraph(f"Languages: {LANGUAGES}", styles["Body"]),
        ListFlowable([wrap_bullet(item, styles) for item in ADDITIONAL_INFO], bulletType="bullet", start="-", leftIndent=9, bulletOffsetY=1),
        Spacer(1, 1),
    ]

    pdf = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )
    pdf.build(story)
    PDF_COPY_PATH.write_bytes(PDF_PATH.read_bytes())


def validate_docx():
    doc = Document(DOCX_PATH)
    text_blocks = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return {
        "paragraphs": len(text_blocks),
        "tables": len(doc.tables),
        "headline": text_blocks[2] if len(text_blocks) > 2 else "",
        "last_line": text_blocks[-1] if text_blocks else "",
    }


def validate_pdf():
    reader = PdfReader(str(PDF_PATH))
    return len(reader.pages)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    build_docx()
    build_pdf()
    docx_info = validate_docx()
    pdf_pages = validate_pdf()

    print(f"DOCX: {DOCX_PATH}")
    print(f"PDF: {PDF_PATH}")
    print(f"DOCX_COPY: {DOCX_COPY_PATH}")
    print(f"PDF_COPY: {PDF_COPY_PATH}")
    print(f"DOCX_PARAGRAPHS: {docx_info['paragraphs']}")
    print(f"DOCX_TABLES: {docx_info['tables']}")
    print(f"HEADLINE: {docx_info['headline']}")
    print(f"LAST_LINE: {docx_info['last_line']}")
    print(f"PDF_PAGES: {pdf_pages}")


if __name__ == "__main__":
    main()
