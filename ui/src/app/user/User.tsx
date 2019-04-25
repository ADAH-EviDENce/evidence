import React from "react";
import Resources from "../Resources";
import FontAwesome from "react-fontawesome";
import Page from "../common/Page";
import ErrorBox from "../common/ErrorBox";
import {AppContext} from "../AppContext";

export default class User extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {loading: true};
        this.requestUsers();
    }

    private requestUsers() {
        Resources.getUsers().then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({users: json, loading: false});
            });
        }).catch(() => {
            this.setState({loading: false, error: 'Could not fetch users.'});
        });
    }

    private handleSelect(user: string) {
        this.context.updateContext({user})
    }

    render() {
        return (
            <Page>
                <h2>Selecteer gebruiker</h2>
                <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                {this.state.loading ?
                    <FontAwesome name='spinner' spin/>
                    :
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
                }
            </Page>
        );
    }
}

User.contextType = AppContext;
