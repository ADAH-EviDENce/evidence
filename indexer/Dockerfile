# Indexer for Evidence. This exists so we can shield ES from the outside world.
# Requires the TargetSize150 directory in this directory.

FROM debian:buster

COPY TargetSize150 TargetSize150

RUN apt-get -y update && apt-get -y install python3-elasticsearch

COPY index.py wait-for-it.sh /utils/
