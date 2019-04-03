#!/bin/sh

[ -e /db/relevance.db ] || (\
	echo "Installing empty relevance database in /db"
	cp empty.db /db/relevance.db
)

echo "Starting server"
exec ./evidence-gui \
	-db /db/relevance.db \
	-doc2vec /data/doc2vec.csv \
	-elastic http://elasticsearch:9200
