import whisper

# Normalizar transcrição do whisper
CORRECOES = {
    "de pirona": "dipirona",
    "di pirona": "dipirona",
    "de pirôna": "dipirona",
    "amoxilina": "amoxicilina",
    "paracetamo": "paracetamol"
}

def normalizar_transcricao(text: str):
    t = text.lower()
    for errado, certo in CORRECOES.items():
        t = t.replace(errado, certo)
    return t

def transcribe_audio(file_path: str):
    result = model.transcribe(file_path, language="pt")
    text = result["text"]
    return normalizar_transcricao(text)


# Auto Corrigir por Similaridade
KNOWN_MEDICINES = ["dipirona", "amoxicilina", "paracetamol", "ibuprofeno"]

def autocorrigir_por_similaridade(text):
    from difflib import get_close_matches

    palavras = text.split()
    for i, p in enumerate(palavras):
        sugestao = get_close_matches(p, KNOWN_MEDICINES, n=1, cutoff=0.7)
        if sugestao:
            palavras[i] = sugestao[0]
    return " ".join(palavras)

#Transcrever o áudio
model = whisper.load_model("base")
def transcribe_audio(file_path: str):
    result = model.transcribe(file_path, language="pt", initial_prompt="Nomes de medicamentos como dipirona, paracetamol, amoxicilina.")
    text = normalizar_transcricao(result["text"])
    text = autocorrigir_por_similaridade(text)
    return text
