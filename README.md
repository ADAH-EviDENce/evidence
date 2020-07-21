# evidence

`evidence` --  a doc2Vec-based assisted close reading tool with support for abstract concept-based search and context-based search.

| Five recommendations for fair software from [fair-software.nl](https://fair-software.nl) | Badges |
| --- | --- |
| 1. Code repository | [![GitHub badge](https://img.shields.io/badge/github-repo-000.svg?logo=github&labelColor=gray&color=blue)](https://github.com/ADAH-EviDENce/evidence/) |
| 2. License | [![License badge](https://img.shields.io/github/license/ADAH-EviDENce/evidence)](https://github.com/ADAH-EviDENce/evidence/) |
| 3. Community registry | [![Research Software Directory](https://img.shields.io/badge/rsd-evidence-00a3e3.svg)](https://www.research-software.nl/software/evidence) |
| 4. Enable citation | [![DOI](https://zenodo.org/badge/DOI/10.0000/FIXME.svg)](https://doi.org/10.0000/FIXME) |
| 5. Checklist | N/A |
| **Other best practices** | |
| Test model generation | [![Test model generation](https://github.com/ADAH-EviDENce/evidence/workflows/Test%20model%20generation/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3A%22Test+model+generation%22) |
| Frontend | [![Frontend](https://github.com/ADAH-EviDENce/evidence/workflows/Frontend/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3A%22Frontend%22) |
| docker-compose | [![docker-compose](https://github.com/ADAH-EviDENce/evidence/workflows/docker-compose/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3Adocker-compose) |
| GitHub Super Linter| [![Lint Code Base](https://github.com/ADAH-EviDENce/evidence/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3A%22Lint+Code+Base%22) |
| Markdown Link Checker| [![Check Markdown links](https://github.com/ADAH-EviDENce/evidence/workflows/Check%20Markdown%20links/badge.svg)](https://github.com/ADAH-EviDENce/evidence/actions?query=workflow%3A%22Check+Markdown+links%22) |

## Machine-supported research in humanities
While research in the humanities has been able to leverage the digitization of text corpora and the development of computer based text analysis tools to its benefit, the interface current systems provide the user with is incompatible with the proven method of scholarly close reading of texts which is key in many research scenarios pursuing complex research questions.

What this boils down to, is the fact that it is often restrictive and difficult, if not impossible, to formulate adequate selection criteria, in particular for more complex or abstract concepts, in the framework of a keyword based search which is the standard entry point to digitized text collections.

## Querying by example - close reading with tailored suggestions  
`evidence` provides an alternative, intuitive entry point into collections. Using the doc2vec framework, `evidence` learns abstract representations of the content of the elements of the user's corpus.
Departing from a set of corpus elements that the user selects as relevant starting points, `evidence` retrieves similar elements and presents them to the user, using the users feedback to refine its retrieval.
This enables a user to combine the power of a close-reading approach with that of a large digitized corpus, selecting elements from the entire corpus which are likely to be of interest, but leaving the decision up to the user as to what evidence they deem useful.

## Documentation for users

## Running the demonstration on Windows

The repository contains a demonstration including a corpus and a model. The demonstration allows you the explore the features of this software without supplying your own corpus.

Prerequisites:

- [Docker desktop](https://docs.docker.com/docker-for-windows/install/)

### Step 1

First test that the docker installation is working. Open a Powershell prompt (press Windows+S and type Powershell) and run:

```shell
docker run hello-world
```

This should show a message that your Docker installation is working correctly. If so, we can proceed to the installation of evidence tool, otherwise we suggest to check the [Docker troubleshooting page](https://docs.docker.com/docker-for-windows/troubleshoot/).

### Step 2

[Download](https://github.com/ADAH-EviDENce/evidence/archive/master.zip) a copy of evidence archive and extract its contents on your machine.

### Step 3

Open a Powershell prompt:
Change your current working directory to where you extracted the files. For instance:

```shell
cd C:\Users\JohnDoe\Downloads\evidence-master\evidence-master
```

The demo can be started with the below command. Keep this Powershell window open and running during the demo.

```shell
$Env:EXPERIMENT="demo"
docker-compose up --build
```

The command above downloads necessary Docker images, builds all the Docker images and starts the demo.

The command prints many log messages. If all goes well, the last lines of the output should be:

```shell
...
indexer_1        | Indexing done.
evidence-master_indexer_1 exited with code 0
```

When using Windows 10 Pro, the Docker containers may not be able to read or write to the folder with the corpus and model. In this case, you get output like the following:

```powershell
PS C:\Users\JohnDoe\evidence-master\evidence-master> docker-compose up --build
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

This can be solved by explicitly giving Docker access to the folder. You can do this by:

1. opening the Docker dashboard by right-clicking the Docker icon in the Windows taskbar
2. go to Settings/Resources/FILE SHARING and add the folder where you extracted the files before
3. try running the command again:

    ```shell
    $Env:EXPERIMENT="demo"
    docker-compose up --build
    ```

### Step 4

Go to the following URL in your web browser: [http://localhost:8080/](http://localhost:8080/ui/search/).

### Step 5

Once you are done with exploring the demo, you can stop it by selecting the PowerShell that is still running the demo and press Ctrl+C.

## Generating a model

### Prerequisites

Verify that your ``docker-compose`` version is at least 1.25.4. (Earlier versions may work).

```shell
docker-compose --version
```

Verify that your ``docker`` version is at least 19.03.12. (Earlier versions may work).

```shell
docker --version
```

### Define which corpus to use

Define the name of the dataset/experiment. Here we choose 'getuigenverhalen'. The corpus files should reside under ``/experiments/<EXPERIMENT>/corpus``, see sample corpora.

```shell
export EXPERIMENT=getuigenverhalen
```

### Building the model generation image

Be aware that building can take a couple of minutes.

```shell
# (starting from the repo root directory)
docker-compose --file generate-model.yml build generate-model
```

## Generating the doc2vec model

```shell
# (starting from the repo root directory)
docker-compose --file generate-model.yml run --user $(id -u):$(id -g) generate-model
```

### Build the user interface web application and start it

```shell
# (starting from the repo root directory)
export EXPERIMENT=getuigenverhalen
docker-compose build
docker-compose up
```

Frontend should now be usable at [``http://localhost:8080``](http://localhost:8080).

> We strongly suggest not making the frontend available publicly as there is no authentication. Anyone with the url will have access to the frontend.
Running it on a local network, for example a university network, should be protected from most evil-doers.

Besides interaction with a web browser you can also interact with the frontend from the command line see [here](ui#elastic-search-example-queries) and [here](ui#doc2vec-example-queries) for examples.

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

## Documentation for developers

### Checking the MarkDown links

When updating the documentation, you can check if the links are all working by running:

```shell
npm install
npm run mlc
```

### Related repositories

[https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework](https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework)

[https://github.com/ADAH-EviDENce/evidence-gui](https://github.com/ADAH-EviDENce/evidence-gui)
