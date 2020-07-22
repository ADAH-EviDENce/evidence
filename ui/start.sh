#!/bin/sh

[ -e /db/relevance.db ] || (\
	echo "Installing empty relevance database in /db"
	mkdir -p /db
	cp /evidence/empty.db /db/relevance.db
)

echo "Starting server"
exec ./evidence-gui \
	-db /db/relevance.db \
	-doc2vec /data/corpus-vectors.json \
	-elastic http://elasticsearch:9200
