FROM golang:1.12-stretch as build

# go-sqlite3 is expensive to compile, so make sure it's cached.
RUN go get github.com/mattn/go-sqlite3

WORKDIR /go/src/github.com/knaw-huc/evidence-gui
COPY . .

RUN go get -t ./...
RUN go test ./...
RUN go install -ldflags="-s" .

FROM debian:buster
RUN apt-get -y update && apt-get -y install sqlite3

WORKDIR /evidence

COPY schema.sql .
RUN sqlite3 relevance.db < schema.sql

COPY --from=build /go/bin/evidence-gui .

EXPOSE 8080

ENTRYPOINT ["./evidence-gui"]
