# WorkingTitleCloseReader
assisted close reading tool  


## Related repositories

[https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework](https://github.com/ADAH-EviDENce/EviDENce_doc2vec_docker_framework)

[https://github.com/ADAH-EviDENce/evidence-gui](https://github.com/ADAH-EviDENce/evidence-gui)



Steps to get the frontend up and running

```
# (starting from the repo root directory)
mkdir ui/data
cd framework
cp template_filenames_config.txt filenames.txt
cp config_template_docker.conf my.conf
# edit my.conf filenames.txt
./run_evidence_framework.sh my.conf filenames.txt
# log into Jupyter server with token (http://localhost:6789)
# run 2 notebooks
curl -X POST http://127.0.0.1:5001/corpusmodelrep -H "Content-Type: application/json" > ../ui/data/doc2vec.json #Looks like you may need to select just the second element of the response, maybe use | jq .'[1]' or something
docker cp testcorpus_testmodel_generate_doc2vec_model:/home/jovyan/output/preprocessed_corpus/template_ids ../ui/data/
docker cp testcorpus_testmodel_generate_doc2vec_model:/home/jovyan/output/preprocessed_corpus/template_corpus 
```

Copy corpus to ui's ``data/``

Contents of my ``ui/data/`` directory look like this

```
data
├── doc2vec.json
├── GV_Zigma_koopvaardij_01_conversation_clipped
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_1001-1008_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_1009-1017_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_103-113_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_114-126_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_127-136_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_137-145_text.txt
...
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_978-984_text.txt
│   ├── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_985-990_text.txt
│   └── GV_Zigma_koopvaardij_01_conversation_clipped_150_paragraph_991-1000_text.txt
├── GV_Zigma_koopvaardij_02_conversation_clipped
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_107-120_text.txt
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_121-135_text.txt
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_136-148_text.txt
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_149-159_text.txt
...
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_82-94_text.txt
│   ├── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_9-15_text.txt
│   └── GV_Zigma_koopvaardij_02_conversation_clipped_150_paragraph_95-106_text.txt
├── GV_Zigma_koopvaardij_03_conversation_clipped
│   ├── GV_Zigma_koopvaardij_03_conversation_clipped_150_paragraph_1001-1007_text.txt
│   ├── GV_Zigma_koopvaardij_03_conversation_clipped_150_paragraph_1008-1015_text.txt
│   ├── GV_Zigma_koopvaardij_03_conversation_clipped_150_paragraph_1016-1024_text.txt
...
│   ├── GV_Zigma_zeemansgezin_09_conversation_clipped_150_paragraph_74-84_text.txt
│   ├── GV_Zigma_zeemansgezin_09_conversation_clipped_150_paragraph_85-93_text.txt
│   └── GV_Zigma_zeemansgezin_09_conversation_clipped_150_paragraph_94-104_text.txt
├── template_corpus
└── template_ids
```

Then,

```
docker-compose -p testcorpus_testmodel stop
cd ../ui
```

Update these lines:

https://github.com/ADAH-EviDENce/WorkingTitleCloseReader/blob/2b652230b150639e73fff3f44a0e72aab7703088/ui/docker-compose.yml#L32-L33

Then
```shell
docker-compose build
docker-compose up -d
```

Add user to the server (you can choose your own username)
```
$ curl -XPOST http://localhost:8080/users -d jspaaks   # note different port than what docs say
```

Frontend should be at ``http://localhost:8080/ui/search/``


