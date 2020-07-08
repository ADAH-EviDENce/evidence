# Build server (backend) image.
FROM golang:1.12-stretch as buildserver

WORKDIR /build

# Download dependencies in a separate step from the actual build,
# so they remain cached when the sources change
# (https://container-solutions.com/faster-builds-in-docker-with-go-1-11/).
COPY go.mod go.sum ./
RUN go mod download

COPY *.go schema.sql ./
COPY internal internal
COPY testdata testdata

RUN go test ./...
RUN go build -ldflags="-s" .


# Build UI (frontend) image.
FROM node:11-alpine as buildui

WORKDIR /evidence
COPY ui/package.json .
COPY ui/package-lock.json .
COPY ui/tsconfig.json .
COPY ui/public public
COPY ui/src src

RUN npm install
RUN npm run build


# Combine server and UI into a deployable image.
FROM debian:buster
RUN apt-get -y update && apt-get -y install sqlite3

WORKDIR /evidence
COPY --from=buildserver /build/evidence-gui ./
COPY --from=buildui /evidence/build ./ui
COPY start.sh .

COPY schema.sql .
RUN sqlite3 empty.db < schema.sql

EXPOSE 8080

ENTRYPOINT ["./evidence-gui"]
