import * as React from "react";
import './SearchPagination.css';

interface SearchPaginationProps {
    page: number,
    lastPage: number,
    onPrevious: Function,
    onNext: Function
}

class SearchPagination extends React.Component<SearchPaginationProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const onFirstPage = this.props.page <= 1;
        const onLastPage = this.props.page >= this.props.lastPage;

        return (
            <div className="search-pagination">
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button
                                className={`page-link ${onFirstPage ? "disabled" : ""}`}
                                onClick={() => this.props.onPrevious()}
                                disabled={onFirstPage}
                            >
                                Vorige
                            </button>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                disabled={true}
                            >
                                {this.props.page}
                            </button>
                        </li>
                        <li className="page-item">
                            <button
                                className={`page-link ${onLastPage ? "disabled" : ""}`}
                                onClick={() => this.props.onNext()}
                                disabled={onLastPage}
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

