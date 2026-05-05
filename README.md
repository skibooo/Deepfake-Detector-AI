# Deepfake-Detector-AI

## Description
A fullstack web application that detects whether an image is real or AI-generated using noise analysis.

## Tech Stack
- FastAPI (Backend)
- React (Frontend)

## Features
- Drag and drop upload
- Image analysis
- Real/Fake classification

## How to Run
The application analyzes the **noise variance** of an image:
- Real images → contain natural random noise  
- AI-generated images → tend to have smoother patterns  

A threshold is used to classify the image:
Low noise → Likely AI-generated
High noise → Likely Real

### Backend
- FastAPI  
- Python  
- NumPy  
- Pillow

### Frontend
- React  
- Vite  
- CSS
