import spacy
import re

nlp = spacy.load("pt_core_news_lg")

DOSAGE_REGEX = r"\b\d+\s?(mg|ml|g|mcg)\b"

KNOWN_MEDICINES = [
    "dipirona",
    "amoxicilina",
    "ibuprofeno",
    "paracetamol",
    "azitromicina"
]

INTENT_KEYWORDS = {
    "BUSCAR_PRODUTO": ["tem", "vende", "preço", "valor", "quanto custa", "dipirona", "amoxicilina", "ibuprofeno"],
    "FALAR_ATENDENTE": ["atendente", "humano", "pessoa", "farmacêutico", "farmaceutico"],
    "MENU_INICIAL": ["menu", "opções", "opcoes", "início", "inicio", "voltar", "0"]
}

def classify_intent(text: str):
    t = text.lower()

    for intent, keywords in INTENT_KEYWORDS.items():
        if any(k in t for k in keywords):
            return intent

    return "DESCONHECIDO"


def extract_entities(text: str):
    doc = nlp(text.lower())

    medicine = None
    dosage = None

    # 🔎 Extrai medicamento
    for token in doc:
        if token.text in KNOWN_MEDICINES:
            medicine = token.text

    # 🔎 Extrai dosagem
    dosage_match = re.search(DOSAGE_REGEX, text.lower())
    if dosage_match:
        dosage = dosage_match.group()

    intent = classify_intent(text)

    return {
        "intent": intent,
        "medicine": medicine,
        "dosage": dosage,
        "raw_text": text
    }
