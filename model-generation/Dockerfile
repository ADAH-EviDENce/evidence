FROM jupyter/base-notebook

COPY environment.yml run.sh /home/jovyan/

RUN conda env create
SHELL ["conda", "run", "-n", "EviDENce", "/bin/bash", "-c"]
RUN conda info && conda init bash

RUN echo "conda activate EviDENce" >> /home/jovyan/.bashrc

#ENTRYPOINT ["/bin/bash", "/home/jovyan/run.sh"]
