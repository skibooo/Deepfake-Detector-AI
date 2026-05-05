from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Enable CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
analysis_history = []


# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}
# Analyze endpoint (noise-based detection)
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()

    try:
        # Load image
        image = Image.open(io.BytesIO(content)).convert("L")  # grayscale
        image_array = np.array(image)

        # Calculate noise (variance)
        noise_level = float(np.var(image_array))

        # Your rule:
        # No noise → fake
        # Noise → real
        if noise_level < 3000:
            prediction = "Likely Deepfake"
            confidence = "82%"

        elif noise_level < 6000:
            prediction = "Possibly Manipulated"
            confidence = "61%"

        else:
            prediction = "Likely Authentic"
            confidence = "77%"

        result = {
            "filename": file.filename,
            "analysis": {
                "noise_level": round(noise_level, 2),
                "prediction": prediction,
                "confidence": confidence
            },
            "status": "completed"
        }

    except Exception as e:
        result = {
            "filename": getattr(file, 'filename', None),
            "error": "Invalid or unsupported file",
            "status": "failed"
        }

    # Save result
    analysis_history.append(result)

    return result


# Get stored results
@app.get("/data")
async def get_data():
    return {
        "count": len(analysis_history),
        "results": analysis_history
    }


# Optional upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "message": "File received successfully"
    }