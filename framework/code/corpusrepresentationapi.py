"""
API to serve model (fragment ids and vectors) to UI/ES framework
"""

from flask import Flask, json, request

import os
import import_ipynb
""" the following is messy,
    but neccessay to import
    the notebooks
"""
cwd=os.getcwd()
os.chdir('/home/jovyan/code')
import filepaths as fp
os.chdir(cwd)


corpusVectorsJsonPath = fp.model_output_corpus_vectors_json_path
corpusModelDict = {}
corpusModelLoaded = False



def create_app():
    app = Flask(__name__)

    def startup_corpusModel_check():
        if not os.path.isfile(corpusVectorsJsonPath):
            print('Your specified model/corpus representation is currently not available. Please be sure to create the appropriate model before attempting to load the ids/vectors list. The  app will remain active.')
            corpusModelPres = False
        else:
            print('Specifed model found.')
            corpusModelPres = True
        return corpusModelPres

    corpusModelPresent= startup_corpusModel_check()
    return app, corpusModelPresent

app, corpusModelPresent = create_app()



def check_for_corpusModel():
    if not os.path.isfile(corpusVectorsJsonPath):
        print('Your specified corpus model representation is currently not available. Please create it.')
        corpusModelFound=False
    else:
        print('Specifed corpus model representation found')
        corpusModelFound=True
    return corpusModelFound


def load_corpusModel():
    cmDict={}
    cmLoaded=False
    try:
        with open(corpusVectorsJsonPath,'r') as jf:
            cmDict = json.load(jf)
        cmLoaded=True
    except:
        print('failed to load corpus model representation. Has it already been created?')

    return cmDict, cmLoaded


@app.before_first_request
def initial_load():
    global corpusModelDict
    global corpusModelPresent
    global corpusModelLoaded

    corpusModelDict, corpusModelLoaded = load_corpusModel()

    if corpusModelLoaded:
        print('loaded')
        corpusModelPresent=True
    else:
        print('failed to find/load specified corpus model representation.')





@app.route('/corpusmodelrep',methods=['POST'])
def expose_corpusModel():
    global corpusModelDict
    global corpusModelPresent
    global corpusModelLoaded

    if corpusModelLoaded:
        pass
    else:
        corpusModelDict, corpusModelLoaded = load_corpusModel()

    return json.dumps([corpusModelLoaded, corpusModelDict])



@app.route('/elementmodelrep',methods=['POST'])
def expose_elementModel():
    global corpusModelDict
    global corpusModelLoaded

    theQuery = request
    fragmentId = theQuery.json['fragmentId']

    fragmentFound=False
    fragmentVector=[]

    if corpusModelLoaded:
        pass
    else :
        corpusModelDict, corpusModelLoaded = load_corpusModel()

    try:
        fragmentVector=corpusModelDict[fragmentId]
        fragmentFound=True
    except:
        pass

    return json.dumps([fragmentFound,{"vector":fragmentVector}])


if __name__=="__main__":
    app.run()
