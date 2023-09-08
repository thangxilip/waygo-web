# Pull base image
FROM python:3.8

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Move code to work dir
RUN mkdir /code
ADD requirements.txt /code/
WORKDIR /code

# Install python dependencies
RUN pip install -r requirements.txt