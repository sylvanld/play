import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="play", # Replace with your own username
    version="0.0.1",
    author="Sylvan LE DEUNFF",
    author_email="sledeunf@enssat.fr",
    description="A project deployment package",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    entry_points = {
        'console_scripts': ['play=play.__main__:main'],
    }
)