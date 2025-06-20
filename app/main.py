import os
from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from bson import ObjectId
from .database import mongodb
from .crud import item_crud
from .models import ItemModel
from .config import settings
from typing import Annotated

app = FastAPI(
    title="FastAPI CRUD with MongoDB",
    debug=settings.debug
)

# 資料庫連接事件
@app.on_event("startup")
async def startup_db_client():
    await mongodb.connect()
    print("Connected to MongoDB Atlas")

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.close()
    print("Disconnected from MongoDB Atlas")

# 靜態文件和模板配置
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# 路由定義
@app.get("/", response_class=HTMLResponse)
async def read_items(request: Request):
    items = await item_crud.get_items()
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "items": items}
    )

@app.get("/items/create", response_class=HTMLResponse)
async def create_item_form(request: Request):
    return templates.TemplateResponse("create.html", {"request": request})

@app.post("/items/create", response_class=HTMLResponse)
async def create_item(
    request: Request,
    name: Annotated[str, Form()],
    description: Annotated[str, Form()] = None
):
    item = ItemModel(name=name, description=description)
    await item_crud.create_item(item)
    return RedirectResponse(url="/", status_code=303)

@app.get("/items/{item_id}/edit", response_class=HTMLResponse)
async def edit_item_form(request: Request, item_id: str):
    item = await item_crud.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return templates.TemplateResponse(
        "edit.html", 
        {"request": request, "item": item}
    )

@app.post("/items/{item_id}/edit", response_class=HTMLResponse)
async def update_item(
    request: Request,
    item_id: str,
    name: Annotated[str, Form()],
    description: Annotated[str, Form()] = None
):
    item = ItemModel(name=name, description=description)
    updated_item = await item_crud.update_item(item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return RedirectResponse(url="/", status_code=303)

@app.delete("/items/{item_id}")
async def delete_item(item_id: str):
    deleted_item = await item_crud.delete_item(item_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}