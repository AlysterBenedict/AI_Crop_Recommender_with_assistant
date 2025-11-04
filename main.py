import pandas as pd
from fastapi import FastAPI
import joblib
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # <-- IMPORT THIS

app = FastAPI()

# --- ADD THIS ENTIRE BLOCK ---
origins = [
    "http://localhost:3000",  # The origin of your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],    # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],    # Allows all headers
)
# --- END OF NEW BLOCK ---

class CropData(BaseModel):
    N: int
    P: int
    K: int
    temperature: float
    humidity: float
    ph: float
    rainfall: float

model = joblib.load('Crop_Model.joblib')

@app.post('/predict')
def predict_crop(data: CropData):
    input_data = pd.DataFrame([data.dict()])
    probabilities = model.predict_proba(input_data)
    prob_each_crop = sorted(zip(model.classes_, probabilities[0]), key=lambda x: x[1], reverse=True)
    top_3_crops = prob_each_crop[0:3]
    result = [{"crop": crop, "confidence": f"{prob*100:.2f}%"} for crop, prob in top_3_crops]
    return {"top_3_recommended_crops": result}