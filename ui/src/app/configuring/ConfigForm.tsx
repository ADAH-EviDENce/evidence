import * as React from "react";
import {AppContext} from "../AppContext";
import {MoreLikeThisType} from "./MoreLikeThisType";
import './ConfigPage.css';
import {Button, ButtonGroup, Col, CustomInput, Input, Label, ListGroup, ListGroupItem, Row} from "reactstrap";
import InfoPopover from "../common/InfoPopover";

class ConfigForm extends React.Component<any, any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            popoverOpen: false
        };
    }

    private updateUseRocchio = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.context.updateContext({useRocchio: e.target.checked})
    };

    private updateSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        var newSize = parseInt(e.target.value) || 0;
        this.context.updateContext({moreLikeThisSize: newSize})
    };

    private useElastic = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.context.updateContext({moreLikeThisType: MoreLikeThisType.ES})
    };

    private useDoc2Vec = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.context.updateContext({moreLikeThisType: MoreLikeThisType.DOC2VEC})
    };

    render() {
        let doc2vecButton;
        let elasticButton;

        if (this.context.moreLikeThisType == MoreLikeThisType.DOC2VEC) {
            doc2vecButton = <Button color='info'>Doc2Vec</Button>;
            elasticButton = <Button outline color='secondary' onClick={this.useElastic}>ElasticSearch (ES)</Button>
        } else {
            elasticButton = <Button color='info'>ElasticSearch (ES)</Button>;
            doc2vecButton = <Button outline color='secondary' onClick={this.useDoc2Vec}>Doc2Vec</Button>;
        }

        return <>
            <ListGroup flush>
                <ListGroupItem>
                    <Row>
                        <Col><Label for='more-like-this-buttons'><em>'More like this'</em>-methode:</Label></Col>
                        <Col>
                            <ButtonGroup id='more-like-this-buttons' size='sm' className="float-right">
                                {doc2vecButton}
                                {elasticButton}
                            </ButtonGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                        <Row>
                            <Col sm='10'>
                                <Label for="more-like-this-size">Aantal fragmenten per <em>'more like this'</em>-pagina:</Label>
                            </Col>
                            <Col sm='2'>
                                <Input id="more-like-this-size"
                                       type="number" min={1}
                                       value={this.context.moreLikeThisSize}
                                       onChange={this.updateSize}
                                       bsSize="sm"
                                       className="float-right"
                                />
                            </Col>
                        </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col sm='10'>
                            <Label for="use-rocchio-check" check>
                                Weeg geannoteerde fragmenten mee tijdens zoeken:
                                <InfoPopover>
                                    <>Op basis van het <a href="https://nlp.stanford.edu/IR-book/html/htmledition/the-rocchio71-algorithm-1.html" target="_blank">rocchio algoritme <i className='fa fa-external-link'/></a></>
                                </InfoPopover>
                            </Label>
                        </Col>
                        <Col sm='2'>
                            <CustomInput
                                defaultChecked={this.context.useRocchio}
                                onChange={this.updateUseRocchio}
                                type="switch"
                                id="use-rocchio-check"
                                name="customSwitch"
                                className="mt-2 pull-right"
                            />
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        </>;
    }
}

export default ConfigForm;
