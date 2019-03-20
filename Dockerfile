FROM golang:1.12-stretch as buildserver

# go-sqlite3 is expensive to compile, so make sure it's cached.
RUN go get github.com/mattn/go-sqlite3

WORKDIR /go/src/github.com/knaw-huc/evidence-gui
COPY . .

RUN go get -t ./...
RUN go test ./...
RUN go install -ldflags="-s" .


FROM node:11-alpine as buildui

WORKDIR /evidence
COPY ui .
#RUN ./build-ui.sh

RUN npm i && npm run build


FROM debian:buster
RUN apt-get -y update && apt-get -y install sqlite3

WORKDIR /evidence

COPY schema.sql .
RUN sqlite3 relevance.db < schema.sql

COPY --from=buildserver /go/bin/evidence-gui .
COPY --from=buildui /evidence/build ./static

EXPOSE 8080

ENTRYPOINT ["./evidence-gui"]
