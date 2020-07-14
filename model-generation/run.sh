#! /bin/bash

echo "starting corpus preprocessing"

conda activate EviDENce

cd /data/notebooks/

jupyter nbconvert --to notebook --execute preprocess_corpus.ipynb
rm preprocess_corpus.nbconvert.ipynb

echo "starting doc2vec model generation"

jupyter nbconvert --to notebook --execute generate_doc2vec_model.ipynb --ExecutePreprocessor.timeout=3600
rm generate_doc2vec_model.nbconvert.ipynb

echo "done"
