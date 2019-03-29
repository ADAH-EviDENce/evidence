import * as React from "react";
import Page from "../common/Page";
import {AppContext} from "../AppContext";
import {MoreLikeThisType} from "./MoreLikeThisType";
import './ConfigPage.css';

class ConfigPage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Page>
                <h2>Instellingen</h2>
                <div className="alert alert-info" role="alert">
                    Wijzigingen aan de onderstaande instellingen worden alleen in de browser opgeslagen. Configureer
                    opnieuw bij herladen van pagina. Configureren tijdens het beoordelen kan tot onverwachte resultaten leiden.
                </div>
                <ul className="list-group list-group-config">
                    <li className="list-group-item">
                        <div className="btn-group btn-group-sm float-right">
                            <button
                                type="button"
                                className={`btn ${this.context.moreLikeThisType === MoreLikeThisType.DOC2VEC ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => this.context.updateContext({moreLikeThisType: MoreLikeThisType.DOC2VEC})}
                            >
                                Doc2Vec
                            </button>
                            <button
                                type="button"
                                className={`btn ${this.context.moreLikeThisType === MoreLikeThisType.ES ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => this.context.updateContext({moreLikeThisType: MoreLikeThisType.ES})}
                            >
                                ElasticSearch (ES)
                            </button>
                        </div>
                        <span className="align-middle"><em>'More like this'</em>-methode:</span>
                    </li>
                    <li className="list-group-item float-right">
                        <div className="form-group row form-group-config">
                            <label htmlFor="more-like-this-size" className="col-sm-10 col-form-label">Aantal fragmenten per <em>'more like this'</em>-pagina:</label>
                            <div className="col-sm-2">
                                <input
                                    className="form-control"
                                    id="more-like-this-size"
                                    value={this.context.moreLikeThisSize}
                                    onChange={(e) => this.context.updateContext({moreLikeThisSize: e.target.value})}/>
                            </div>
                        </div>
                    </li>
                </ul>
            </Page>
        );
    }
}

ConfigPage.contextType = AppContext;

export default ConfigPage;