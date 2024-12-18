from pydantic import UUID4, BaseModel, validator
from datetime import datetime
from typing import List, Dict, Optional

class ConnectionSchema(BaseModel):
    hwid: str
    user_name: str
    machine_name: str
    logs: List[str] = []
    version: Dict[str, str] = {}

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class VersionSchema(BaseModel):
    hwid: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class LogSchema(BaseModel):
    hwid: str = ""
    logs: List[Dict[str, str]] = []
    version: Dict[str, str] = {}
    last_log_timestamp: str = ""

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True