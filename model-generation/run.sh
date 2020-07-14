#! /bin/bash

echo "starting corpus preprocessing"

jupyter nbconvert --to notebook --execute /data/preprocess_corpus.ipynb

echo "starting doc2vec model generation"

jupyter nbconvert --to notebook --execute /data/generate_doc2vec_model.ipynb

echo "done"
