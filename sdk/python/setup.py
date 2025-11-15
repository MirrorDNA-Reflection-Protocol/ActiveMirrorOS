# FEU-Enforced Module | Master Citation v15.2 | Fact/Estimate/Unknown Protocol Active
# This module operates under MirrorDNA Reflective AI constraints.
# All outputs must be tagged as Fact, Estimate, or Unknown.
"""
Setup script for ActiveMirrorOS Python SDK.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="activemirror",
    version="0.2.0-hardening",
    author="MirrorDNA-Reflection-Protocol",
    author_email="contact@mirrordna.org",
    description="Consumer OS layer for persistent, reflective AI experiences",
    keywords=["MirrorDNA", "Reflective AI", "ActiveMirrorOS", "LingOS", "ai", "memory", "reflection"],
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "pyyaml>=6.0",
        "cryptography>=41.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-cov>=4.0",
            "mypy>=1.0",
            "ruff>=0.1.0",
            "black>=23.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "amos=activemirror.cli:main",
        ],
    },
)
