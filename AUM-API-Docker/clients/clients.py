from fastapi import Depends, HTTPException, status, APIRouter, Response, Request, Header
from datetime import datetime
import os
from base64 import b64encode

from . import schemas
from config import *
from logger import Logger
from database import get_db

router = APIRouter()

@router.get("/check", response_description="Check if the provided version number is less than the GLOBAL PATCH VERSION")
async def check_patch(
    payload: schemas.VersionSchema,
    db = Depends(get_db)
):
    
    global LATEST_PATCH_VERSION
    patch = await get_latest_patch_version(db=db)

    if not patch["status"]:
        return patch
    LATEST_PATCH_VERSION = patch["patch"]["version"]

    data = payload.dict()
    data["_id"] = data["hwid"]
    data.pop('hwid')

    if (connection := await db["connections"].find_one({"_id": data["_id"]})) is None:
        return {
            'status': False,
            'message': f'Connection with HWID {data["_id"]} not found!'
        }

    curr_ver = connection['version']['ProductVersion']

    Logger.info(f"Current version of {data['_id']}: {curr_ver}")
    Logger.info(f"Max Version in DB: {LATEST_PATCH_VERSION}")

    if curr_ver < LATEST_PATCH_VERSION:
        patch = None
        latest_file = max([f"patches/{f}" for f in os.listdir("patches")], key=os.path.getctime)
        with open(latest_file, 'rb') as f:
            patch = f.read()

        Logger.info(f"Sending patch to {data['_id']}")
        return {
            'status': True,
            'message': f'Connection with HWID {data["_id"]} needs to update!',
            'filename': latest_file.split('/')[-1],
            'patch': b64encode(patch)
        }

    return {
        'status': False,
        'message': f'Connection with HWID {data["_id"]} is already on the latest patch: {LATEST_PATCH_VERSION}'
    }

@router.post('/add', response_description="Add a new connection into the database")
async def add_connection(
    payload: schemas.ConnectionSchema,
    db = Depends(get_db)
):
    print(payload.dict())
    data = payload.dict()
    data["_id"] = data["hwid"]
    data.pop('hwid')

    if (connection := await db["connections"].find_one({"_id": data["_id"]})) is not None:
        data["first_callback"] = connection["first_callback"]
        data["last_callback"] = str(datetime.now())
        data["version"] = connection["version"]
        data["logs"] = connection["logs"]

        await db["connections"].update_one({"_id": data["_id"]}, {"$set": data})
        return {
            'status': True,
            'message': f'Connection with HWID {data["_id"]} updated successfully!'
        }

    data["first_callback"] = data["last_callback"] = str(datetime.now())
    # Add this data to the mongodb:
    await db["connections"].insert_one(data)

    return {
        'status': True,
        'message': 'Connection successful!'
    }

@router.post("/insert", response_description="Inserts logs for a connection")
async def insert_logs(
    payload: schemas.LogSchema = None,
    db = Depends(get_db)
):
    data = payload.dict()
    data["_id"] = data["hwid"]
    data.pop('hwid')
    data["last_callback"] = str(datetime.now())

    if (connection := await db["connections"].find_one({"_id": data["_id"]})) is None:
        return {
            'status': False,
            'message': f'Connection with HWID {data["_id"]} not found!'
        }, 400

    # Check if payload has last_log_timestamp
    if "last_log_timestamp" in data:
        # Get only the logs after the last_log_timestamp
        logs = [log for log in data["logs"] if log["Timestamp"] > data["last_log_timestamp"]]

    print("Current logs: %d" % len(connection["logs"]))
    data["logs"] = logs + connection["logs"]

    print("Updating %d logs" % len(data["logs"]))
    await db["connections"].update_one({"_id": data["_id"]}, {"$set": data})
    return {
        'status': True,
        'message': f'Logs added successfully for {data["_id"]}'
    }

@router.get('/list', response_description="List all connections")
async def list_connections(db = Depends(get_db)):
    return await db["connections"].find().to_list(1000)
    
@router.get('/get', response_description="Get a connection by HWID")
async def get_connection(
    hwid: str,
    db = Depends(get_db)
):
    if (connection := await db["connections"].find_one({"_id": hwid})) is None:
        return {
            'status': False,
            'message': f'Connection with HWID {hwid} not found!'
        }
    return connection

@router.delete('/delete', response_description="Delete a connection by HWID")
async def delete_connection(
    hwid: str,
    db = Depends(get_db)
):
    if (connection := await db["connections"].find_one({"_id": hwid})) is None:
        return {
            'status': False,
            'message': f'Connection with HWID {hwid} not found!'
        }
    await db["connections"].delete_one({"_id": hwid})
    return {
        'status': True,
        'message': f'Connection with HWID {hwid} deleted successfully!'
    }

@router.put('/update', response_description="Update a connection by HWID")
async def update_connection(
    payload: schemas.ConnectionSchema,
    db = Depends(get_db)
):
    data = payload.dict()
    data["_id"] = data["hwid"]
    data.pop('hwid')
    data["last_callback"] = str(datetime.now())

    if (connection := await db["connections"].find_one({"_id": data["_id"]})) is None:
        return {
            'status': False,
            'message': f'Connection with HWID {data["_id"]} not found!'
        }

    await db["connections"].update_one({"_id": data["_id"]}, {"$set": data})
    return {
        'status': True,
        'message': f'Connection with HWID {data["_id"]} updated successfully!'
    }
    