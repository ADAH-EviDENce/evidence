import React from "react";
import Resources from "../Resources";
import FontAwesome from "react-fontawesome";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import {Link, withRouter} from "react-router-dom";

class UserPage extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            loading: true,
            users: [],
            error: null
        };
        this.requestUsers();
    }

    private requestUsers() {
        Resources.getUsers().then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                if (json && json.length > 0) {
                    this.setState({loading: false, users: json});
                } else {
                    this.setState({loading: false, error: "No users found"});
                }
            });
        }).catch(() => {
            this.setState({loading: false, error: 'Could not fetch users.'});
        });
    }

    private handleSelect(user: string) {
        this.context.updateContext({user})
    }

    private renderUserForm() {
        return <>
            <ul className="list-group d-flex" role="group">
                {this.state.users.map((user: any, i: number) => {
                    return <li
                        key={i}
                        className="list-group-item list-group-item-action">
                        <div className="custom-control custom-radio">
                            <input
                                id={`name-${user}`}
                                name="names"
                                type="radio"
                                className="custom-control-input"
                                checked={user === this.context.user}
                                onChange={() => this.handleSelect(user)}
                            />
                            <label
                                className="custom-control-label w-100"
                                htmlFor={`name-${user}`}
                            >
                                {user}
                            </label>
                        </div>
                    </li>
                })}
            </ul>
            {this.renderBtns()}
        </>;
    }

    private renderBtns() {
        return <div className="float-right mt-3 mb-3">
            <button
                onClick={() => this.props.history.goBack()}
                className="search btn btn-sm btn-success mr-3"
                disabled={!this.context.user}
            >
                <FontAwesome name="chevron-left"/>
                &nbsp;
                Terug
            </button>
            <button
                onClick={() => this.props.history.push("/search/")}
                className="search btn btn-sm btn-success"
                disabled={!this.context.user}
            >
                Zoeken
                &nbsp;
                <FontAwesome name="chevron-right"/>
            </button>
        </div>;
    }

    render() {
        return (
            <Page>
                <h2>Selecteer gebruiker</h2>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                {this.state.loading ?
                    <FontAwesome name='spinner' spin/>
                    :
                    this.renderUserForm()
                }
            </Page>
        );
    }
}

UserPage.contextType = AppContext;

export default withRouter(UserPage);