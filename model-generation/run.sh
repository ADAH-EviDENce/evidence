#!/bin/bash

set -e

source /opt/conda/bin/activate evidence
echo "Using Python: "$(which python)

echo "starting corpus preprocessing"
jupyter nbconvert --to python preprocess_corpus.ipynb
python3 preprocess_corpus.py && rm -f preprocess_corpus.py

echo "starting doc2vec model generation - this takes a few minutes"
jupyter nbconvert --to python generate_doc2vec_model.ipynb
python3 generate_doc2vec_model.py && rm -f generate_doc2vec_model.py
