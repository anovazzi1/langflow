from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from langflow.app import create_app

import logging

LOGGER = logging.getLogger(__name__)


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except HTTPException as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex

app = create_app()
path = Path(__file__).parent / "frontend/build"
app.mount(
    "/",
    SPAStaticFiles(directory=path,html = True),
    name="static",
)

def main():
    import uvicorn

    uvicorn.run(app, host="localhost", port=5003)


if __name__ == "__main__":
    main()
