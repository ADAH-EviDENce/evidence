#! /bin/bash

echo "starting corpus preprocessing"

jupyter nbconvert --to notebook --execute preprocess_corpus.ipynb && rm preprocess_corpus.nbconvert.ipynb || exit 1

echo "starting doc2vec model generation - this takes a few minutes"

jupyter nbconvert --to notebook --execute generate_doc2vec_model.ipynb --ExecutePreprocessor.timeout=3600 && rm generate_doc2vec_model.nbconvert.ipynb || exit 1

echo "done"
