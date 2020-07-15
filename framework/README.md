# EviDENce_doc2vec_docker_framework

The repository provides the functionality to ingest a corpus (of document fragments), build a doc2vec model incl. model space vectors for each fragment, and infer vectors for out-of-corpus fragments. Furthermore, it provides an API serving the model representation of the full corpus (id, vector pairs) as well as the model representation (vector) for a in-corpus fragment based on its id. The derived models, the inferal-engine, and the representation api can and are meant to be interfaced with the user-interface framwork in the [evidence-gui](https://github.com/knaw-huc/evidence-gui) repository. Initial, limited instructions are provided [below](#interface-to-evidence-gui) .

In order to provide portable and reproducible models we make use of a framework of Docker containers coordinated by the Docker Compose tool.

Details are provided below

## Let's get started
In order to get started
- clone this repository to a location of your choice
- copy your corpus into the `/input/corpus_input` directory (PLEASE take care to remove the test corpus currently present)
- configure the `config_template_docker.conf` file accorrding to your preferences and save as `<your-config>.conf`
- configure filename declaration `template_filenames_config.txt` file according to your preferences and save as `<your-filenames>.txt`
- start up the framework by invoking `./run_evidence_framwork.sh <your-config>.conf <your-filenames>.txt`
- with a browser navigate to `http://127.0.0.1:6789` and log in with the token in the `<tag-name>_token_file.txt` file
- run the `preprocess_corpus.ipynb` to process the corpus
- run the `generate_doc2vec_model.ipynb` notebook to generate the model and corpus vectors


The inference engine can be queried via a RESTapi at `http://127.0.0.1:5000/infer_vector`:

    curl -X POST http://127.0.0.1:5000/infer_vector -H "Content-Type: application/json" -d '{"text": "hallo"}'

The API returns a json dump with the inferred vector as well as a `model_loaded` boolean indicating whether the model required for inference was present when thee query was present.

- the representation API can be queried via RESTapi at `http://127.0.0.1:5001/corpusmodelrep` and will provide a json dump of the full corpus representation for the model. To obtain the model represenation of an individual corpus element the representation api can be queried at `http://127.0.0.1:5001/elementmodelrep` the query must supply the fragment id in json format as {"fragmentId":<id>}. Both dumps return a list with a boolean indicating whether the requested model was present as the first element and a (json) dictionary of the results as the second element.

The command `docker-compose -p <tag-name> down`
stops the framework and removes the containers. Results are perpetuated to the DOCKER volumes created.

See Docker and Docker Compose documentation for more details


## Interface to evidence-gui
While the framework provided in this repository deals with the ingestion and (pre-)processing of a corpus, as well as the subsequent construction of a doc2vec model, a complementary backend/database and GUI frontend supporting user-interactions and queries on the corpus has been developed by the KNAW HUC team text and can be found [here](https://github.com/knaw-huc/evidence-gui).

Work on the interface between both components is in progress, and not all functionality provided here is currently supported. In particular the inference for out of corpus fragments is not integrated. Combinded use of both elements requires some preparatory action byt the user. A set of instructions is provided in the following:

- Run `EviDENce_doc2vec_docker_framework`, performing preprocessing and model creation steps
- query the representation API and save the corpus model represenatation as `doc2vec.json`
- clone the [evidence-gui repository](https://github.com/knaw-huc/evidence-gui)
  - following the local setup instructions `mkdir data`
  - copy the full corpus_input directory into data
  - copy the `<your_corpus>_corpus`, `<your_corpus>_ids`, and `doc2vec.json` files into the data directory
  - follow the run instructions to bring the backed and GUI up for the corpus and model provided
  - further instructions, e.g. on how to add users, are available in the [repository](https://github.com/knaw-huc/evidence-gui).
