# EviDENce_doc2vec_docker_framework

The repository provides the functionality to ingest a corpus (of document fragments), build a doc2vec model incl. model space vectors for each fragment, and infer vectors for out-of-corpus fragments. Furthermore, it provides an API serving the model representation of the full corpus (id, vector pairs) as well as the model representation (vector) for a in-corpus fragment based on its id. The derived models, the inferal-engine, and the representation api can and are meant to be interfaced with the user-interface framwork in the XXX repository.

In order to provide portable and reproducible models we make use of a framework of Docker containers coordinated by the Docker Compose tool.

Details are provided below

## tl;dr -- Let's get started   
In order to get started
- clone this repository to a location of your choice
- copy your corpus into the `/input/corpus_input` directory (PLEASE take care to remove the test corpus currently present)
- configure the `config_template_docker.conf` file accorrding to your preferences and save as `<your-config>.conf`
- configure filename declaration `template_filenames_config.txt` file according to your preferences and save as `<your-filenames>.txt`
- start up the framework by invoking `./run_evidence_framwork.sh <your-config>.conf <your-filenames>.txt`
- with a browser navigate to `http://127.0.0.1:6789` and log in with the token in the `<tag-name>_token_file.txt` file
- run the `preprocess_corpus.ipynb` to process the corpus
- run the `generate_doc2vec_model.ipynb` notebook to generate the model and corpus vectors
- the inferal-engine can be queried via a RESTapi at `http://127.0.0.1:5000/infer_vector`
- the api returns a json dump with the inferred vector as well as a model_loaded boolean indicating whether the model required for inferrance was present when the query was present.
- the representation API can be queried via RESTapi at `http://127.0.0.1:5001/corpusmodelrep` and will provide a json dump of the full corpus representation for the model. To obtain the model represenation of an individual corpus element the representation api can be queried at `http://127.0.0.1:5001/elementmodelrep` the query must supply the fragment id in json format as {"fragmentId":<id>}. Both dumps return a list with a boolean indicating whether the requested model was present as the first element and a (json) dictionary of the results as the second element.

The command `docker-compose -p <tag-name> down`
stops the framework and removes the containers. Results are perpetuated to the DOCKER volumes created.

See Docker and Docker Compose documentation for more details

## More detailed
