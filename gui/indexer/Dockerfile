# Indexer for Evidence. This exists so we can shield ES from the outside world.
# Requires /data to point to the 'TargetSize150' directory

FROM debian:buster

RUN apt-get -y update && apt-get -y install python3-elasticsearch

COPY index.py wait-for-it.sh /utils/
