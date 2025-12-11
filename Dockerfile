# syntax=docker/dockerfile:1

FROM golang:1.23 AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/server ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/migrator ./cmd/migrate

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /out/server /app/server
COPY --from=build /out/migrator /app/migrator
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

ENV DATABASE_URL=postgres://postgres:postgres@db:5432/app?sslmode=disable \
    PORT=8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["/app/server"]
