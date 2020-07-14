FROM jupyter/base-notebook

COPY environment.yml run.sh /home/jovyan/

RUN conda env create
SHELL ["conda", "run", "-n", "myopic", "/bin/bash", "-c"]
RUN conda info && conda init bash

RUN echo "conda activate myopic" >> /home/jovyan/.bashrc

#ENTRYPOINT ["bash", "/home/jovyan/run.sh"]