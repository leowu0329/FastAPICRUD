from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        def validate(value: Any) -> str:
            if isinstance(value, ObjectId):
                return str(value)
            if isinstance(value, str):
                try:
                    ObjectId(value)
                    return value
                except:
                    pass
            raise ValueError("Invalid ObjectId")
        
        return core_schema.no_info_plain_validator_function(
            validate,
            serialization=core_schema.to_string_ser_schema(),
        )

class ItemModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )