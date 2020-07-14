```shell
IMAGE_NAME=jup
```

Building the image

```shell
docker build --tag ${IMAGE_NAME} .
```

Running

```shell
docker run -ti --mount type=bind,source="$(pwd)"/notebooks,target=/data ${IMAGE_NAME} /bin/bash
```

or

```shell
docker run -ti -v ${PWD}/notebooks:/data ${CONTAINER_NAME} /bin/bash

```
