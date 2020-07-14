FROM continuumio/miniconda3

COPY environment.yml run.sh /app/

WORKDIR /app

# create and activate virtual environment
RUN conda env create --file environment.yml

ENV PATH /opt/conda/envs/EviDENce/bin:$PATH

SHELL ["conda", "run", "--name", "EviDENce", "/bin/bash", "-c"]

RUN conda info && conda init bash
RUN python -m ipykernel install --user --name conda-env-EviDENce-py

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
