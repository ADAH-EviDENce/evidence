# Troubleshooting:

## Permisson issue on Windows
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

    ```powershell
    $Env:EXPERIMENT="getuigenverhalen"
    docker-compose up --build
    ```
