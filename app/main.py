import os
from fastapi import FastAPI, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
from typing import Annotated

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="app/templates")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
async def read_items(request: Request, db: Session = Depends(get_db)):
    items = crud.get_items(db)
    return templates.TemplateResponse(
        "index.html", {"request": request, "items": items}
    )

@app.get("/items/create", response_class=HTMLResponse)
async def create_item_form(request: Request):
    return templates.TemplateResponse("create.html", {"request": request})

@app.post("/items/create", response_class=HTMLResponse)
async def create_item(
    request: Request,
    name: Annotated[str, Form()],
    description: Annotated[str, Form()],
    db: Session = Depends(get_db),
):
    item = schemas.ItemCreate(name=name, description=description)
    crud.create_item(db=db, item=item)
    items = crud.get_items(db)
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "items": items, "message": "Item created successfully!"}
    )

@app.get("/items/{item_id}/edit", response_class=HTMLResponse)
async def edit_item_form(request: Request, item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return templates.TemplateResponse("edit.html", {"request": request, "item": item})

@app.post("/items/{item_id}/edit", response_class=HTMLResponse)
async def update_item(
    request: Request,
    item_id: int,
    name: Annotated[str, Form()],
    description: Annotated[str, Form()],
    db: Session = Depends(get_db),
):
    item = schemas.ItemCreate(name=name, description=description)
    db_item = crud.update_item(db=db, item_id=item_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    items = crud.get_items(db)
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "items": items, "message": "Item updated successfully!"}
    )

@app.delete("/items/{item_id}", response_class=HTMLResponse)
async def delete_item(request: Request, item_id: int, db: Session = Depends(get_db)):
    db_item = crud.delete_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    items = crud.get_items(db)
    return templates.TemplateResponse(
        "partials/_messages.html", 
        {"request": request, "message": "Item deleted successfully!"}
    )