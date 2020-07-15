# WorkingTitleCloseReader
assisted close reading tool


## Related repositories

[https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework](https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework)

[https://github.com/ADAH-EviDENce/evidence-gui](https://github.com/ADAH-EviDENce/evidence-gui)

## Generating a model from the corpus

Define the name of the dataset/experiment
```shell
EXPERIMENT=getuigenverhalen
```

### Building the image

Be aware that building can take a couple of minutes.

Verify that your ``docker-compose`` version is at least 1.25.4

```
docker-compose --version
```

Verify that your ``docker`` version is at least 19.03.12

```
docker --version
```

```shell
# (starting from the repo root directory)
docker build --tag doc2vec model-generation/
```

### Running interactively

```shell
docker run -ti --volume ${PWD}/model-generation/notebooks:/data/notebooks \
               --volume ${PWD}/experiments/${EXPERIMENT}/corpus:/data/corpus \
               --volume ${PWD}/experiments/${EXPERIMENT}/model:/data/model \
               --user $(id -u):$(id -g) \
               doc2vec /bin/bash
```

### Running non-interactively

```shell
docker run --volume ${PWD}/model-generation/notebooks:/data/notebooks \
           --volume ${PWD}/experiments/${EXPERIMENT}/corpus:/data/corpus \
           --volume ${PWD}/experiments/${EXPERIMENT}/model:/data/model \
           --user $(id -u):$(id -g) \
           doc2vec
```

## Steps to get the frontend up and running

- Verify that your ``docker-compose`` version is at least 1.25.4
- Verify that your ``docker`` version is at least 19.03.12

```shell
# (starting from the repo root directory)
export EXPERIMENT=getuigenverhalen
docker-compose build
docker-compose up -d
```

Add user to the server (you can choose your own username)
```
$ curl -XPOST http://localhost:8080/users -d jspaaks   # note different port than what docs say
```

Frontend should now be usable at [``http://localhost:8080``](http://localhost:8080).
