"""
Accepts a string (corresponding to a fragment) and returns
a vector inferred based on an instance of a doc2vec model.
"""


from flask import Flask, json, request
import os
import numpy as np
import gensim
import import_ipynb
""" the following is messy,
    but neccessay to import
    the notebooks
"""
cwd=os.getcwd()
os.chdir('/home/jovyan/code')
import filepaths as fp
import tokenizer
import corpus_reinferral
os.chdir(cwd)

modelfilepath=fp.model_output_file_path
model=[]
model_loaded=False
#model_present = False

def create_app():
    app = Flask(__name__)

    def startup_model_check():
        if not os.path.isfile(modelfilepath):
            print('Your specified model is currently not available. Please be sure to create the appropriate model before attempting to infer vectors. The  app will remain active.')
            model_pres = False
        else:
            print('Specifed model found.')
            model_pres = True
        return model_pres

    model_present= startup_model_check()
    return app, model_present

app, model_present = create_app()


#model_loaded=False

def check_for_model():
    if not os.path.isfile(modelfilepath):
        print('Your specified model is currently not available. Please create model.')
        model_found=False
    else:
        print('Specifed model foud')
        model_found=True
    return model_found


def load_model():
    mod = gensim.utils.SaveLoad.load(modelfilepath)
    model_load=True
    return mod, model_load


@app.before_first_request
def intial_load():
    global model
    global model_present
    global model_loaded
    if model_present==True:
        model, model_loaded = load_model()
        print('model loaded')
    else:
        model_found = check_for_model()
        if model_found == True:
            model, model_loaded = load_model()
            model_present=True
            print('model loaded')
        else:
            pass
            print('specified model not found and not loaded')





def infer_vector(the_query,the_model):
    query_fragment = the_query.json['text']

    processed_query_fragment = tokenizer.preprocess_fragment(query_fragment).split(' ')

    fragment_vector = corpus_reinferral.reinfer_fragment_vector(processed_query_fragment,the_model).tolist()

    return fragment_vector


@app.route('/infer_vector',methods=['POST'])
def execute_inferal():
    global model
    global model_present
    global model_loaded
    the_query = request
    fragment_vector=[]

    if model_loaded == True:
        fragment_vector = infer_vector(the_query,model)
    else:
        if model_present==True:
                model, model_loaded = load_model()
                print('model loaded')
                fragment_vector = infer_vector(the_query,model)
        else:
            model_found = check_for_model()
            if model_found == True:
                model, model_loaded = load_model()
                model_present = True
                print('model loaded')
                fragment_vector = infer_vector(the_query,model)
            else:
                print('specified model is not present and not loaded')

    return json.dumps({"vector":fragment_vector,"model_present":model_present,"model_loaded":model_loaded})








if __name__=="__main__":
    app.run()
