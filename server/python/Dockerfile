FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ARG SERVER_HOST
ARG SERVER_PORT
ARG SERVER_LOG_LEVEL
ARG SERVER_NUM_WORKERS

ENV SERVER_HOST=$SERVER_HOST
ENV SERVER_PORT=$SERVER_PORT
ENV SERVER_LOG_LEVEL=$SERVER_LOG_LEVEL
ENV SERVER_NUM_WORKERS=$SERVER_NUM_WORKERS

EXPOSE $SERVER_HOST

CMD python main.py --host $SERVER_HOST --port $SERVER_PORT --log-level $SERVER_LOG_LEVEL --num-workers $SERVER_NUM_WORKERS
