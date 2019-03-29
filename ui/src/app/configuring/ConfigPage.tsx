import * as React from "react";
import Page from "../common/Page";
import {AppContext} from "../AppContext";
import {MoreLikeThisType} from "./MoreLikeThisType";

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
                    Wijzigingen aan de onderstaande instellingen worden alleen in de browser opgeslagen. Configureer opnieuw bij herladen van pagina.
                </div>
                <ul className="list-group">
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
                </ul>
            </Page>
        );
    }
}

ConfigPage.contextType = AppContext;

export default ConfigPage;