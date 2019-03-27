import * as React from "react";

interface SearchPaginationProps {
    from: number,
    onPrevious: Function,
    onNext: Function
}

class SearchPagination extends React.Component<SearchPaginationProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="search-pagination">
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => this.props.onPrevious()}
                            >
                                Vorige
                            </button>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                disabled={true}
                            >
                                {this.props.from + 1}
                            </button>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => this.props.onNext()}
                            >
                                Volgende
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default SearchPagination;

