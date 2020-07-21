import React from "react";
import Resources from "../Resources";
import InfoBox from "../common/InfoBox";
import Spinner from "../common/Spinner";

interface UserFormProps {
    formContext: any,
    updateFormContext: Function
}

class UserForm extends React.Component<UserFormProps, any> {

    private abort: AbortController = new AbortController();

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            loading: true,
            users: [],
            error: null
        };
        this.requestUsers();
    }

    public componentWillUnmount() {
        // prevent calling setState on unmounted component:
        this.abort.abort();
    }

    private requestUsers() {
        Resources.getUsers(this.abort.signal).then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                if (json && json.length > 0) {
                    this.setState({loading: false, users: json});
                } else {
                    this.setState({loading: false, error: 'No users found.'});
                }
            });
        }).catch((e: Error) => {
            if(e.name  === 'AbortError') return;
            this.setState({loading: false, error: 'Error occured during retrieval of users.'});
        });
    }

    private handleSelect(user: string) {
        this.props.updateFormContext({user});
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
                                checked={user === this.props.formContext.user}
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
                {this.state.loading
                    ? <Spinner />
                    : this.renderUserForm()
                }
            </>
        );
    }
}

export default UserForm;
