FROM debian:buster
ENV DEBIAN_FRONTEND noninteractive 
RUN apt-get -y update && apt-get -y install curl

COPY wait-for-it.sh /utils/wait-for-it.sh
