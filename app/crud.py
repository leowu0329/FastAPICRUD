from .models import ItemModel
from .database import mongodb
from bson import ObjectId

class ItemCRUD:
    async def get_items(self, skip: int = 0, limit: int = 100):
        items = []
        async for item in mongodb.db.items.find().skip(skip).limit(limit):
            item["_id"] = str(item["_id"])  # 轉換 ObjectId 為字符串
            items.append(ItemModel(**item))
        return items

    async def get_item(self, item_id: str):
        item = await mongodb.db.items.find_one({"_id": ObjectId(item_id)})
        if item:
            item["_id"] = str(item["_id"])  # 轉換 ObjectId 為字符串
            return ItemModel(**item)
        return None

    async def create_item(self, item: ItemModel):
        item_dict = item.model_dump(by_alias=True, exclude={"id"})
        result = await mongodb.db.items.insert_one(item_dict)
        created_item = await self.get_item(str(result.inserted_id))
        return created_item

    async def update_item(self, item_id: str, item: ItemModel):
        item_dict = item.model_dump(by_alias=True, exclude={"id"})
        await mongodb.db.items.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": item_dict}
        )
        return await self.get_item(item_id)

    async def delete_item(self, item_id: str):
        item = await self.get_item(item_id)
        if item:
            await mongodb.db.items.delete_one({"_id": ObjectId(item_id)})
        return item

item_crud = ItemCRUD()