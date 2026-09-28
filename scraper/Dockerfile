FROM python:3.12.10-alpine
ARG PORT
ENV PORT=${PORT}
RUN pip install poetry
COPY . .
RUN poetry config virtualenvs.create false
RUN poetry install --no-root
EXPOSE $PORT
CMD hypercorn --bind [::]:${PORT} app:app
