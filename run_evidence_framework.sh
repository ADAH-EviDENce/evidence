#!/bin/bash
#
#
# wrapper script to run EviDENce doc2vec docker services
#
# INPUTS:
# $1 :: docker config template (e.g. config_template_docker.conf)
# $2 :: model/storage file declaration (e.g. template_filenames_config.txt) 


#source the config file
source $1

#setup environment variables and a perpetuated environment file
TAG_NAME=${CORPUS_NAME}_${MODEL_NAME}

ENVIRONMENTFILE=${TAG_NAME}.env

> ${ENVIRONMENTFILE}
echo "TAG=${TAG_NAME}" >> ${ENVIRONMENTFILE}
echo "CORPUSNAME=${CORPUS_NAME}" >> ${ENVIRONMENTFILE}
echo "MODELNAME=${MODEL_NAME}" >> ${ENVIRONMENTFILE}
echo "INPUTPATH=${INPUT_PATH}" >> ${ENVIRONMENTFILE}
echo "CONFIGPATH=${CONFIG_PATH}" >>$ENVIRONMENTFILE
echo "CODEPATH=${CODE_PATH}" >> ${ENVIRONMENTFILE}
echo "DERIVEDPATH=${DERIVED_PATH}" >> ${ENVIRONMENTFILE}

#copy the environment file to the .env file used by docker-compose
cp ${ENVIRONMENTFILE} .env


#copy file name declartion config file to config directory and set up perpetuated filename_config with uniform naming
cp $2 ./config/filenames_config.txt
cp $2 ${TAG_NAME}_filenames_config.txt


#run docker compose using the .env file and TAG_NAME as unique project name
docker-compose --project-name ${TAG_NAME} up -d
docker-compose --project-name ${TAG_NAME} logs | tail -100 > ${TAG_NAME}_logs.txt

#retrieve token for jupyter lab and write to dockerfile
docker exec -it ${TAG_NAME}_generate_doc2vec_model bash -c 'cat /home/jovyan/.local/share/jupyter/runtime/*.html' > conttokens.txt

python get_lab_token.py conttokens.txt > ${TAG_NAME}_token_file.txt

rm conttokens.txt
