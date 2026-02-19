# Chat Bot Farmácia

Chatbot Baileys usando API FastAPI + spaCy para NLP em português.

## 📦 Instalação
```bash
/// Criar ambiente virtual
python -m venv .venv
/// Ativar ambiente:
.venv\Scripts\Activate
/// Instalar dependências
pip install -r requirements.txt
/// Baixar modelo do spaCy
python -m spacy download pt_core_news_lg

```

🚀 Rodar localmente

API (microserviço) nlp_service\
```bash
python -m uvicorn app:app --reload --port 8000 
```

Chatbot

```bash
node src\app.js
```

📁 Estrutura do projeto
/src – código principal da API

/nlp_service – código de NLP e modelos

/nlp_service/requirements.txt – dependências
