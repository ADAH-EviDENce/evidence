# evidence

Assisted close reading tool

| Five recommendations for fair software from [fair-software.nl](https://fair-software.nl) | Badges |
| --- | --- |
| 1. Code repository | [![GitHub badge](https://img.shields.io/badge/github-repo-000.svg?logo=github&labelColor=gray&color=blue)](https://github.com/ADAH-EviDENce/evidence/) |
| 2. License | [![License badge](https://img.shields.io/github/license/ADAH-EviDENce/evidence)](https://github.com/ADAH-EviDENce/evidence/) |
| 3. Community registry | [![Research Software Directory](https://img.shields.io/badge/rsd-evidence-00a3e3.svg)](https://www.research-software.nl/software/evidence) |
| 4. Enable citation | [![DOI](https://zenodo.org/badge/DOI/10.0000/FIXME.svg)](https://doi.org/10.0000/FIXME) |
| 5. Checklist | N/A |
| **Other best practices** | |
| GitHub Super Linter| [![Lint Code Base](https://github.com/ADAH-EviDENce/evidence/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3A%22Lint+Code+Base%22) |
| docker-compose | [![docker-compose](https://github.com/ADAH-EviDENce/evidence/workflows/docker-compose/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3Adocker-compose) |

## Related repositories

[https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework](https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework)

[https://github.com/ADAH-EviDENce/evidence-gui](https://github.com/ADAH-EviDENce/evidence-gui)

## Running the demo on Windows

Prerequisites:

- [Docker desktop](https://docs.docker.com/docker-for-windows/install/)

### Step 1

First test that the docker installation is working. Open a Powershell prompt (press Windows+S and type Powershell) and run:

```shell
docker run hello-world
```

This should show a message that your Docker installation is working correctly. If so, we can proceed to the installation of WorkingTitleCloseReader, otherwise we suggest to check the steps in the [Docker installation guide](https://docs.docker.com/docker-for-windows/install/).

### Step 2

[Download](https://github.com/ADAH-EviDENce/evidence/archive/master.zip) a copy of WorkingTitleCloseReader archive and extract its contents on your machine.

### Step 3

Open a Powershell prompt:
Change your current working directory to where you extracted the files. For instance:

```shell
cd C:\Users\JohnDoe\Downloads\evidence-master\evidence-master
```

The demo can be started with the below command. Keep this Powershell window open and running during the demo.

```shell
docker-compose --env-file getuigenverhalen.env up --build
```

The command above downloads necessary docker images, does a docker build and starts containers needed.

The command prints many log messages. If all goes well, the last lines of the output should be:

```shell
...
indexer_1        | Indexing done.
evidence-master_indexer_1 exited with code 0
```

In some cases, the docker containers cannot access the necessary folder. In this case, you get output like the following:

```powershell
PS C:\Users\JohnDoe\evidence-master> docker-compose --env-file getuigenverhalen.env up --build
Creating network "evidence-master_default" with the default driver
Building server
Step 1/28 : FROM golang:1.12-stretch as buildserver
 ---> 563601c9e3b2
...
Creating evidence-master_elasticsearch_1 ... done                                                                               Creating evidence-master_indexer_1       ... error
ERROR: for evidence-master_indexer_1  Cannot create container for service indexer: status code not OK but 500: {"Message":"Unhandled exception: Filesharing has been cancelled",...

ERROR: for evidence-master_server_1  Cannot create container for service server: status code not OK but 500: {"Message":"Unhandled exception: Filesharing has been cancelled",...

ERROR: for indexer  Cannot create container for service indexer: status code not OK but 500: {"Message":"Unhandled exception: Filesharing has been cancelled",...

ERROR: for server  Cannot create container for service server: status code not OK but 500: {"Message":"Unhandled exception: Filesharing has been cancelled",...
ERROR: Encountered errors while bringing up the project.
```

This can be solved by explicitly giving docker access to it. Do this by opening the Docker dashboard by right-clicking the docker icon in the Windows taskbar. Then, go to Settings/Resources/FILE SHARING and add the folder where you extracted the files before, and try running the command above again.

### Step 4

Go to the following URL in your webbrowser: [http://localhost:8080/](http://localhost:8080/ui/search/).

### Step 5

Once you done exploring the demo, you can stop the demo by selecting the powershell that is still running the demo and press Ctrl+C.

## Generating a model from the corpus

Define the name of the dataset/experiment

```shell
export EXPERIMENT=getuigenverhalen
```

### Building the image

Be aware that building can take a couple of minutes.

Verify that your ``docker-compose`` version is at least 1.25.4

```shell
docker-compose --version
```

Verify that your ``docker`` version is at least 19.03.12

```shell
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
docker-compose up
```

Frontend should now be usable at [``http://localhost:8080``](http://localhost:8080).

> We strongly suggest not making the frontend available publicly as we do not have autentication. Anyone that knows the url may have an access to the frontend.
Running it on local network, for example university network, should be protected from most evil-doers.

## Frontend users

The first page of the frontend forces you to select a user or gebruiker in Dutch.
A user called `demo` exists and can be selected.

### Change initial user

The initial user in the frontend can be renamed by setting the `FRONTEND_USER` environment variable before running `docker-compose up`.

For example to have `myinitialusername` as user do the following

```shell
# (starting from the repo root directory)
export EXPERIMENT=getuigenverhalen
export FRONTEND_USER=myinitialusername
docker-compose up
```

### Add additional users

If the existing user is not enough, you can add a new user to the frontend with the following command:
(you can choose your own username by replacing `mynewusername` value in command)

```shell
export EXPERIMENT=getuigenverhalen
export FRONTEND_USER=mynewusername
docker-compose run usercreator
```

To add more users, repeat the command with different values for `FRONTEND_USER`.


## Diagram

![EviDENce_framework_intial-2.png](documentation/EviDENce_framework_intial-2.png)
