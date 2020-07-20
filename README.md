# evidence

Word2Vec-based assisted close reading tool with support for context-based search and concept-based search.

## Prerequisites

Verify that your ``docker-compose`` version is at least 1.25.4. (Earlier versions may work).

```shell
docker-compose --version
```

Verify that your ``docker`` version is at least 19.03.12. (Earlier versions may work).

```shell
docker --version
```

## Define which corpus to use

Define the name of the dataset/experiment. Here we choose 'getuigenverhalen'. The corpus files should reside under ``/experiments/<EXPERIMENT>/corpus``, see sample corpora.

```shell
export EXPERIMENT=getuigenverhalen
```

## Building the model generation image

Be aware that building can take a couple of minutes.

```shell
# (starting from the repo root directory)
docker-compose --file generate-model.yml build generate-model
```

## Generating the word2vec model

```shell
# (starting from the repo root directory)
docker-compose --file generate-model.yml run --user $(id -u):$(id -g) generate-model
```

## Build the user interface web application and start it

```shell
# (starting from the repo root directory)
export EXPERIMENT=getuigenverhalen
docker-compose build
docker-compose up
```

Frontend should now be usable at [``http://localhost:8080``](http://localhost:8080).

> We strongly suggest not making the frontend available publicly as there is no authentication. Anyone with the url will have access to the frontend.
Running it on a local network, for example a university network, should be protected from most evil-doers.

## Optional: manage frontend users

The first page of the frontend forces you to select a user or 'gebruiker' in Dutch.
A user called `demo` exists and can be selected.

### Change initial user

The initial user named ``demo`` can be renamed by setting the `FRONTEND_USER` environment variable before running `docker-compose up`.

For example to have `myinitialusername` as a user name, do the following:

```shell
# (starting from the repo root directory)
export EXPERIMENT=getuigenverhalen
export FRONTEND_USER=myinitialusername
docker-compose up
```

### Add additional users

If the existing user is not enough, you can add a new user to the frontend with the following command
(you can choose your own username by replacing `mynewusername` value in the command below):

```shell
export EXPERIMENT=getuigenverhalen
export FRONTEND_USER=mynewusername
docker-compose run usercreator
```

To add more users, repeat the command with different values for `FRONTEND_USER`.

---


## Diagram

![EviDENce_framework_intial-2.png](documentation/EviDENce_framework_intial-2.png)


## Related repositories

[https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework](https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework)

[https://github.com/ADAH-EviDENce/evidence-gui](https://github.com/ADAH-EviDENce/evidence-gui)
