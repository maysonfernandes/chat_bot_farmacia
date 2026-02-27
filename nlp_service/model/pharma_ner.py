import spacy
import re
import mysql.connector

nlp = spacy.load("pt_core_news_lg")

DOSAGE_REGEX = r"\b\d+\s?(mg|ml|g|mcg)\b"

# Buscando medicamentos conhecidos no banco de dados para reconhecimento de entidades
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="farmacia_chatbot"
)

cursor = conn.cursor()
cursor.execute("""
    SELECT DISTINCT PRODUTO
    FROM TA_PRECO_MEDICAMENTO
    WHERE PRODUTO IS NOT NULL
      AND PRODUTO <> '';
""")

KNOWN_MEDICINES = [row[0].lower() for row in cursor.fetchall()]

# Intenções comuns e suas palavras-chave para classificação simples
INTENT_KEYWORDS = {
    "BUSCAR_PRODUTO": ["tem", "vende", "preço", "valor", "quanto custa"] ,
    "FALAR_ATENDENTE": ["atendente", "humano", "pessoa", "farmacêutico", "farmaceutico"],
    "MENU_INICIAL": ["menu", "opções", "opcoes", "início", "inicio", "voltar", "0"]
}

# Função para classificar a intenção do usuário com base em palavras-chave
def classify_intent(text: str):
    t = text.lower()

    for intent, keywords in INTENT_KEYWORDS.items():
        if any(k in t for k in keywords):
            return intent

    return "DESCONHECIDO"

# Função principal para extrair entidades e classificar intenção
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
