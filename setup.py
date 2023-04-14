import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="streamlit-annotation",
    version="0.0.1",
    author="Robin Marquet",
    author_email="robin.marquet3@gmail.com",
    description="Component for annotating text for NLP resolution",
    long_description=long_description,
    long_description_content_type="text/plain",
    url="https://github.com/rmarquet21/steamlit-annotation",
    packages=setuptools.find_packages(),
    include_package_data=True,
    python_requires=">=3.8",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    install_requires=[
        "streamlit >= 1.0.0",
    ],
)
