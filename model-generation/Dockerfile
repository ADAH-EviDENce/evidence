FROM jupyter/base-notebook:python-3.8.3


COPY environment.yml run.sh /home/jovyan/

RUN conda env create --file environment.yml

RUN source /opt/conda/etc/profile.d/conda.sh && \
    conda init bash && \
    conda activate evidence && \
    ipython kernel install --name "evidence" --user

RUN echo -e "#Activate the evidence virtual environment\nconda activate evidence" >> /home/jovyan/.bashrc

WORKDIR /data/notebooks/

ENTRYPOINT ["/bin/bash", "/home/jovyan/run.sh"]
CMD ""
