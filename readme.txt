python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn spacy
python -m spacy download pt_core_news_lg

python -m uvicorn app:app --reload --port 8000