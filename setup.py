"""Setup script."""


import re
from os import path
from io import open
from setuptools import setup, find_packages
from setuptools.command.sdist import sdist

__encode__ = "utf8"

DISTNAME = "langflow"
DESCRIPTION = "Python package to help create language model flows"
AUTHOR = ""
AUTHOR_EMAIL = ""
URL = "https://github.com/logspace-ai/langflow"
LICENSE = "MIT License"

CLASSIFIERS = [
    "Programming Language :: Python",
    "Programming Language :: Python :: 3.11",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
    "Intended Audience :: Science/Research",
    "Topic :: Scientific/Engineering",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
    "Topic :: Scientific/Engineering :: Visualization",
    "Operating System :: OS Independent",
]


class CustomSdistCommand(sdist):
    def run(self):
        import subprocess

        # js files are in langflow/frontend and we need to build them
        # before we can package them
        subprocess.check_call(["npm", "install"], cwd="langflow/frontend")
        subprocess.check_call(["npm", "run", "build"], cwd="langflow/frontend")

        sdist.run(self)


__cwd__ = path.abspath(path.dirname(__file__))
__readme_file__ = path.join(__cwd__, "README.md")
with open(__readme_file__, encoding=__encode__) as readme:
    LONG_DESCRIPTION = readme.read()


_version_re__ = r"__version__\s*=\s*['\"]([^'\"]+)['\"]"
__init_file__ = path.join(__cwd__, f"{DISTNAME}/__init__.py")
with open(__init_file__, encoding=__encode__) as __init__py:
    VERSION = re.search(_version_re__, __init__py.read())[1]


if __name__ == "__main__":
    setup(
        name=DISTNAME,
        version=VERSION,
        maintainer=AUTHOR,
        maintainer_email=AUTHOR_EMAIL,
        description=DESCRIPTION,
        license=LICENSE,
        url=URL,
        long_description=LONG_DESCRIPTION,
        long_description_content_type="text/markdown",
        packages=find_packages(),
        package_data={DISTNAME: ["frontend/**/*", "frontend/**/**/*"]},
        include_package_data=True,
        classifiers=CLASSIFIERS,
        python_requires=">=3.7",
        install_requires=["langchain", "fastapi", "uvicorn"],
        tests_require=["pytest"],
        extras_require={},
        entry_points={"console_scripts": ["langflow=langflow.cli:main"]},
        cmdclass={"sdist": CustomSdistCommand},
    )
