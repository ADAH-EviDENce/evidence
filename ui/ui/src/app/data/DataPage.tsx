import React from "react";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import * as FileSaver from "file-saver";
import Resources from "../Resources";
import ConfirmModal from "../common/ConfirmModal";

export default class DataPage extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            purging: false,
            savingWithPurge: false,
            purgeOnSaveFile: true
        };
    }

    private saveFile = () => {
        const exportFilename = 'export.csv';
        return Resources.getExport(this.context.user).then((data) => {
            const csv = new Blob([data], {type: "text/csv;charset=utf-8"});
            FileSaver.saveAs(csv, exportFilename);
        }).catch(() => {
            this.setState({error: 'CSV-file could not be retrieved'});
        });
    };

    private purgeDatabase = () => {
        Resources.purgeDatabase(this.context.user).then(() => {
            this.setState({purging: false, info: 'Database has been emptied.'});
        }).catch(() => {
            this.setState({purging: false, error: 'Database could not be emptied.'});
        });
    };

    private confirmPurge = () => {
        this.setState({purging: true});
    };

    private conformSaveWhenWithPurge = () => {
        if(this.state.purgeOnSaveFile) {
            this.setState({savingWithPurge: true});
        } else {
            this.saveFile();
        }
    };

    private handleSetPurgeOnSaveFile = () => {
        this.setState({purgeOnSaveFile: !this.state.purgeOnSaveFile});
    };
    private saveFileAndPurge = () => {
        this.saveFile().then(() => {
            this.purgeDatabase();
            this.setState({savingWithPurge: false});
        });
    };

    render() {
        return (
            <Page>
                <h2>Data</h2>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <InfoBox msg={this.state.info} type="info" onClose={() => this.setState({info: null})}/>
                <ul className="list-group d-flex" role="group">
                    <li className="list-group-item list-group-item-action">
                        Export as csv
                        <div className="btn-group float-right">
                            <button
                                onClick={this.conformSaveWhenWithPurge}
                                className="btn btn-info btn-sm"
                            >
                                <i className='fa fa-download'/>
                                &nbsp;
                                Download
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={this.handleSetPurgeOnSaveFile}
                            >
                                <i className={`far ${this.state.purgeOnSaveFile ? 'fa-check-square' :'fa-square'}`}/>
                                &nbsp;
                                and empty database?
                            </button>
                        </div>
                    </li>
                    <li className="list-group-item list-group-item-action">
                        Empy database
                        <button
                            onClick={this.confirmPurge}
                            className="float-right btn btn-danger btn-sm"
                        >
                            <i className='fa fa-trash'/>
                            &nbsp;
                            Empy
                        </button>
                    </li>
                </ul>
                <ConfirmModal
                    onCancel={() => this.setState({purging: false})}
                    onContinue={this.purgeDatabase}
                    isOpen={this.state.purging}
                    msg="You are going to empty the database"
                />
                <ConfirmModal
                    onCancel={() => this.setState({savingWithPurge: false})}
                    onContinue={this.saveFileAndPurge}
                    isOpen={this.state.savingWithPurge}
                    msg="You are also going to empty the database."
                />
            </Page>
        );
    }
}

DataPage.contextType = AppContext;
