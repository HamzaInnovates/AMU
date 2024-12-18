import os
from fastapi import FastAPI, Request, Body, HTTPException, status, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder

from config import *
from schemas import LatestPatchSchema, UploadFileSchema

import clients
from logger import Logger
from database import get_db

import uvicorn

Logger.log("Starting AUM-API...")

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/patches", StaticFiles(directory="patches"), name="patches")
app.include_router(clients.router, tags=['Clients Management'], prefix='/api/clients')

@app.get("/")
def root():
    return {
        "status" : True,
        "message" : "AUM-API v1.0"
    }

@app.get("/latest")
async def get_latest_patch(
    db = Depends(get_db)
):
    global LATEST_PATCH_VERSION
    return await get_latest_patch_version(db=db)

@app.post("/latest")
async def set_latest_patch(
    payload: LatestPatchSchema,
    db = Depends(get_db)
):
    global LATEST_PATCH_VERSION
    data = payload.dict()
    data["_id"] = "latest_patch_version"
    if (patch := await db["config"].find_one({"_id": "latest_patch_version"})) is None:
        await db["config"].insert_one(data)
    else:
        await db["config"].update_one({"_id": "latest_patch_version"}, {"$set": data})
    LATEST_PATCH_VERSION = data["version"]
    return {
        "status" : True,
        "message" : "Latest patch version updated"
    }

@app.post("/upload")
async def upload_file(
    name : str = Form(...),
    version: str = Form(...),
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    global LATEST_PATCH_VERSION  
    patch = await get_latest_patch_version(db=db)
    if not patch["status"]:
        return patch
    
    Logger.info(f"Latest patch version found: {LATEST_PATCH_VERSION}")

    data = {}
    data["name"] = name
    data["version"] = version
    data["_id"] = data["name"]
    data.pop('name')
    if (patch := await db["patches"].find_one({"_id": data["_id"]})) is not None:
        if patch["version"] >= LATEST_PATCH_VERSION:
            return {
                "status" : False,
                "message" : "An equal or greater patch version already exists"
            }
        else:
            await db["patches"].update_one({"_id": data["_id"]}, {"$set": data})

    else:
        await db["patches"].insert_one(data)

    invalid_chars = {" " : "_","." : "_","/" : "_","\\" : "_","*": "_",":" : "_","?" : "_","\"" : "_","<" : "_",">" : "_","|" : "_"}

    for char in invalid_chars:
        data["_id"] = data["_id"].replace(char, invalid_chars[char])

    # get extension from file name
    ext = name.split('.')[-1]

    try:
        with open(f"patches/{data['_id']}.{ext}", "wb") as f:
            f.write(await file.read())
    except Exception as e:
        return {
            "status" : False,
            "message" : "Failed to upload patch"
        }
    return {
        "status" : True,
        "message" : "Patch uploaded successfully"
    }

Logger.info("Testing connection with DB")
db = get_db()
if type(db) == Exception:
    Logger.error("Connection failed")
    exit()
Logger.log("Connection successful")
Logger.log("AUM-API started successfully")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)