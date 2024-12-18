from pydantic import UUID4, BaseModel, validator
from datetime import datetime
from typing import List, Dict, Optional

class LatestPatchSchema(BaseModel):
    version: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class UploadFileSchema(BaseModel):
    name: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True