import * as React from "react";

interface FivePagePaginationProps {
    page: number
    total: number,
    onPageClick: Function
}

class FivePagePagination extends React.Component<FivePagePaginationProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const current = this.props.page;
        const total = this.props.total;
        const range = FivePagePagination.getDisplayedPages(current, total);

        const first = range[0];
        const second = range[1];
        const third = range[2];
        const fourth = range[3];
        const fifth = range[4];

        return (
            <ul className="pagination justify-content-center mt-3" aria-label="Page navigation">
                <li className={`page-item ${first === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(1)} className="btn-link page-link">
                        «
                    </button>
                </li>
                <li className={`page-item ${first === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(current - 1)} className="btn-link page-link">
                        ‹
                    </button>
                </li>
                <li className={`page-item`}>
                    <button onClick={() => this.props.onPageClick(first)} className="btn-link page-link">
                        {first}
                    </button>
                </li>
                <li className={`page-item ${total < 2 ? 'd-none' : ''}`}>
                    <button onClick={() => this.props.onPageClick(second)} className="btn-link page-link">
                        {second}
                    </button>
                </li>
                <li className={`page-item ${total < 3 ? 'd-none' : ''}`}>
                    <button onClick={() => this.props.onPageClick(third)} className="btn-link page-link">
                        {third}
                    </button>
                </li>
                <li className={`page-item ${total < 4 ? 'd-none' : ''}`}>
                    <button onClick={() => this.props.onPageClick(fourth)} className="btn-link page-link">
                        {fourth}
                    </button>
                </li>
                <li className={`page-item ${total < 5 ? 'd-none' : ''}`}>
                    <button onClick={() => this.props.onPageClick(fifth)} className="btn-link page-link">
                        {fifth}
                    </button>
                </li>
                <li className={`page-item ${current >= total ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(current + 1)} className="btn-link page-link">
                        ›
                    </button>
                </li>
                <li className={`page-item ${fifth >= total ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(total)} className="btn-link page-link">
                        »
                    </button>
                </li>
            </ul>
        );
    }

    private static getDisplayedPages(current: number, total: number): Array<number> {
        let middle = current;
        if (current < 3) {
            middle = 3;
        }
        if (total > 5 && middle > total - 2) {
            middle = total - 2;
        }
        return [
            middle - 2,
            middle - 1,
            middle,
            middle + 1,
            middle + 2,
        ];
    }
}

export default FivePagePagination;