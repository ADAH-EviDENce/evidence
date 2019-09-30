import React from "react";
import Resources from "../Resources";
import FontAwesome from "react-fontawesome";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import {withRouter} from "react-router-dom";

class UserForm extends React.Component<any, any> {

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
                    this.setState({loading: false, error: 'Geen gebruikers gevonden.'});
                }
            });
        }).catch(() => {
            this.setState({loading: false, error: 'Er trad een fout op bij het ophalen van de gebruikers.'});
        });
    }

    private handleSelect(user: string) {
        this.context.updateContext({user})
    }

    private renderUserForm() {
        return <>
            <ul className="list-group d-flex list-group-flush" role="group">
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
        </>;
    }

    render() {
        return (
            <>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                {this.state.loading ?
                    <FontAwesome name='spinner' spin/>
                    :
                    this.renderUserForm()
                }
            </>
        );
    }
}

UserForm.contextType = AppContext;

export default withRouter(UserForm);