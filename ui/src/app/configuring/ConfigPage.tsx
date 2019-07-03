import * as React from "react";
import Page from "../common/Page";
import {AppContext} from "../AppContext";
import {MoreLikeThisType} from "./MoreLikeThisType";
import './ConfigPage.css';
import {
    Alert,
    Button,
    ButtonGroup,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";

class ConfigPage extends React.Component<any, any> {
    private updateUseRocchio: (e: React.ChangeEvent<HTMLInputElement>) => void;
    private updateSize: (e: React.ChangeEvent<HTMLInputElement>) => void;
    private useElastic: (e: React.MouseEvent) => void;
    private useDoc2Vec: (e: React.MouseEvent) => void;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};

        this.updateUseRocchio = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.context.updateContext({useRocchio: e.target.checked})
        };

        this.updateSize = (e: React.ChangeEvent<HTMLInputElement>) => {
            var newSize = parseInt(e.target.value) || 0;
            this.context.updateContext({moreLikeThisSize: newSize})
        }

        this.useElastic = (e: React.MouseEvent) => {
            this.context.updateContext({moreLikeThisType: MoreLikeThisType.ES})
        }

        this.useDoc2Vec = (e: React.MouseEvent) => {
            this.context.updateContext({moreLikeThisType: MoreLikeThisType.DOC2VEC})
        }
    }

    render() {
        let doc2vecButton
        let elasticButton

        if (this.context.moreLikeThisType == MoreLikeThisType.DOC2VEC) {
            doc2vecButton = <Button color='info'>Doc2Vec</Button>
            elasticButton = <Button outline color='secondary' onClick={this.useElastic}>ElasticSearch (ES)</Button>
        } else {
            elasticButton = <Button color='info'>ElasticSearch (ES)</Button>
            doc2vecButton = <Button outline color='secondary' onClick={this.useDoc2Vec}>Doc2Vec</Button>
        }

        return (
            <Page>
                <h2>Instellingen</h2>
                <Alert color='info'>
                    Wijzigingen aan de onderstaande instellingen worden alleen in de browser opgeslagen. Configureer
                    opnieuw bij herladen van pagina. Configureren tijdens het beoordelen kan tot onverwachte resultaten
                    leiden.
                </Alert>
                <ListGroup>
                    <ListGroupItem>
                        <Container>
                            <Row>
                                <Col>
                                <span
                                    className="align-middle align-content-center"><em>'More like this'</em>-methode:</span>
                                </Col>
                                <Col>
                                    <ButtonGroup size='sm' className="float-right">
                                        {doc2vecButton}
                                        {elasticButton}
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup check>
                                        <Input type="checkbox" name="check" id="use-rocchio-check"
                                               defaultChecked={this.context.useRocchio}
                                               onChange={this.updateUseRocchio}
                                        />
                                        <Label for="use-rocchio-check" check>
                                            Weeg geannoteerde fragmenten mee tijdens zoeken (<a
                                            href="https://nlp.stanford.edu/IR-book/html/htmledition/the-rocchio71-algorithm-1.html">Rocchio
                                            algoritme</a>)
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Container>
                    </ListGroupItem>
                    <ListGroupItem>
                        <FormGroup>
                            <Row>
                                <Col sm='10'>
                                    <Label for="more-like-this-size">Aantal fragmenten per <em>'more like this'</em>-pagina:</Label>
                                </Col>
                                <Col sm='2'>
                                    <Input id="more-like-this-size"
                                           type="number" min={1}
                                           value={this.context.moreLikeThisSize}
                                           onChange={this.updateSize}/>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ListGroupItem>
                </ListGroup>
            </Page>
        );
    }
}

ConfigPage.contextType = AppContext;

export default ConfigPage;