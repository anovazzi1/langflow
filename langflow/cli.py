from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# get the directory of the current file
path = Path(__file__).parent
static_files_dir = path / "frontend/build"
app = FastAPI()

app.mount(
    "/",
    StaticFiles(directory=static_files_dir, html=True),
    name="static",
)


def main():
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)


if __name__ == "__main__":
    main()
