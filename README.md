# EviDENce_doc2vec_docker_framework

The repository provides the functionality to ingest a corpus (of document fragments), build a doc2vec model incl. model space vectors for each fragment, and infer vectors for out-of-corpus fragments. The derived models and the inferal-engine are interfaced with the user-interface framwork in the XXX repository.

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

The command `docker-compose -p <tag-name> down`
stops the framework and removes the containers. Results are perpetuated to the DOCKER volumes created.

See Docker and Docker Compose documentation for more details
