# PiktID Face Modifier

A full-stack image anonymization and face editing web app powered by the PiktID API.  
Users can upload an image, modify facial expressions (e.g. make a face "happy"), and download the modified version. Built using **FastAPI**, **React + Vite**, and deployed via **Railway** and **Vercel**.

---

## Live Demo

 [Frontend (Vercel)](https://your-vercel-link.vercel.app)  
 [Backend (Railway)](https://piktid-api-test-production.up.railway.app)

---

## Features

- Upload an image from your device
- Modify facial expression using PiktID AI
- See a side-by-side preview of original and modified images
- Download the processed image

## Running Locally

### Backend
```bash
cd eraseid-web/backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
---
Create a .env file in the backend folder and fill the needed variables with username and password from Piktid.
```bash
ERASEID_EMAIL=your-email
ERASEID_PASSWORD=your-password
```
### Frontend
```bash
cd eraseid-web/frontend
npm install
npm run dev
```
Create a .env file in the frontend folder:
```bash
VITE_BACKEND_URL=http://localhost:8000
```

