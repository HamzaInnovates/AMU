'''ALL THE GLOBALS
'''
LATEST_PATCH_VERSION = None

async def get_latest_patch_version(db):
    global LATEST_PATCH_VERSION
    if (patch := await db["config"].find_one({"_id": "latest_patch_version"})) is None:
        return {
            "status" : False,
            "message" : "Latest patch version not found in database"
        }
    print(f"[*] GOT PATCH OBJECT: {dict(patch)}")
    LATEST_PATCH_VERSION = patch["version"]
    print(f"Latest patch version found: {LATEST_PATCH_VERSION}")

    return {
        "status" : True,
        "message" : "Latest patch version found",
        "patch" : patch
    }
    
