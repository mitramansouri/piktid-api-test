import os
import uuid
import random
import shutil

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from eraseid_api import start_call
from eraseid_utils import process_single_image
import traceback


# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend to access this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    result_link = None  # Safe default

    try:
        # Save uploaded file to disk
        filename = f"temp_{uuid.uuid4().hex}_{file.filename}"
        with open(filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Log in
        email = os.getenv("ERASEID_EMAIL")
        password = os.getenv("ERASEID_PASSWORD")
        token_dict = start_call(email, password)

        # Params
        params = {
            'INPUT_PATH': filename,
            'FLAG_HAIR': True,
            'CHANGE_ALL_FACES': False,
            'CHANGE_EXPRESSION_FLAG': True,
            'NEW_EXPRESSION': 'happy',
            'CHANGE_SKIN': False,
            'SEED': random.randint(1, 1_000_000),
        }

        # Process the image
        result_link = process_single_image(params, token_dict)
        print(f"✅ result_link = {result_link}")

        if not result_link or not isinstance(result_link, str):
            raise Exception("No valid image link returned.")

        return {
            "message": "Image processed successfully!",
            "result_url": result_link
        }

    except Exception as e:
        print(f"❌ Backend error: {str(e)}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "result_url": result_link  # Return even if None
            }
        )

