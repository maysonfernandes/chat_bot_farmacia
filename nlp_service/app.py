from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from model.pharma_ner import extract_entities
from model.speech_to_text import transcribe_audio 
import shutil
import uuid

app = FastAPI()

class TextRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(request: TextRequest):
    return extract_entities(request.text)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_path = f"tmp_{uuid.uuid4()}.ogg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe_audio(temp_path)

    return { "text": text }
