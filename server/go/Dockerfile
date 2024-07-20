# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Production stage
FROM alpine:latest  

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

ARG SERVER_HOST
ARG SERVER_PORT
ARG SERVER_LOG_LEVEL
ARG SERVER_NUM_WORKERS

ENV SERVER_HOST=$SERVER_HOST
ENV SERVER_PORT=$SERVER_PORT
ENV SERVER_LOG_LEVEL=$SERVER_LOG_LEVEL
ENV SERVER__NUM_WORKERS=$SERVER_NUM_WORKERS

EXPOSE $SERVER_PORT

CMD ./main --host ${SERVER_HOST} --port ${SERVER_PORT} --log-level ${SERVER_LOG_LEVEL} --num-workers ${SERVER_NUM_WORKERS}