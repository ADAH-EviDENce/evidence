#!/bin/bash

set -e

echo "starting corpus preprocessing"
jupyter nbconvert --to python preprocess_corpus.ipynb
python preprocess_corpus.py && rm -f preprocess_corpus.py

echo "starting doc2vec model generation - this takes a few minutes"
jupyter nbconvert --to python generate_doc2vec_model.ipynb
python generate_doc2vec_model.py && rm -f generate_doc2vec_model.py
