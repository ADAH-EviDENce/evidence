"""
Accepts a string (corresponding to a fragment) and returns
a vector inferred based on an instance of a doc2vec model.
"""

#Import required packages and modules

from flask import Flask, json, request
import os
#import configparser
import numpy as np
import gensim
import import_ipynb
#import filepaths as fp
#import tokenizer
#import corpus_reinferral


model=[] # this is a placeholder for the global 'model' variable

app = Flask(__name__)

@app.before_first_request
def load_model():
    global model
    #model = gensim.utils.SaveLoad.load(fp.model_output_file_path)
    print('loaded model')




@app.route('/infer_vector',methods=['POST'])
def infer_vector():
    #global model
    #query_fragment = request.json['text']

    #processed_query_fragment = tokenizer.preprocess_fragment(query_fragment).split(' ')

    #fragment_vector = corpus_reinferral.reinfer_fragment_vector(processed_query_fragment,model).tolist()

    #return json.dumps({"vector":fragment_vector})
    return json.dumps({"result":"a result"})
