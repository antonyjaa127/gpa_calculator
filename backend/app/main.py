from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union

from .gpa import calculate_both_gpa


class CourseInput(BaseModel):
    grade: Union[str, float]
    credit: int = Field(..., ge=0)


class GPARequest(BaseModel):
    existing_gpa: Optional[float] = None
    existing_credits: int = Field(0, ge=0)
    new_courses: List[CourseInput]

    @validator("existing_gpa")
    def validate_existing_gpa(cls, v):
        if v is None:
            return v
        if v < 0.0 or v > 4.0:
            raise ValueError("existing_gpa 0.0 ile 4.0 arasında olmalıdır")
        return v


class GPAResponse(BaseModel):
    term_gpa: float
    cumulative_gpa: float


app = FastAPI(title="GPA Calculator API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/calculate", response_model=GPAResponse)
async def calculate(req: GPARequest):
    courses = [(c.grade, c.credit) for c in req.new_courses]
    result = calculate_both_gpa(req.existing_gpa, req.existing_credits, courses)
    # Yuvarlama UI tarafına da bırakılabilir; burada iki ondalık formatına yakınsatalım
    return GPAResponse(
        term_gpa=float(result["term_gpa"]),
        cumulative_gpa=float(result["cumulative_gpa"]),
    )
