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
        const fifth = range[4];

        return (
            <ul className="pagination justify-content-center mt-3" aria-label="Page navigation">
                <li className={`page-item ${first === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(1)} className="btn-link page-link">
                        «
                    </button>
                </li>
                <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => this.props.onPageClick(current - 1)} className="btn-link page-link">
                        ‹
                    </button>
                </li>

                {this.createPageNo(first, 1, total, current)}
                {this.createPageNo(range[1], 2, total, current)}
                {this.createPageNo(range[2], 3, total, current)}
                {this.createPageNo(range[3], 4, total, current)}
                {this.createPageNo(fifth, 5, total, current)}

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

    private createPageNo(
        no: number,
        min: number,
        total: number,
        current: number
    ) {
        return <li className={
            `page-item
            ${total < min ? 'd-none' : ''}
            ${no === current ? 'active' : ''}
            `}
        >
            <button onClick={() => this.props.onPageClick(no)} className="btn-link page-link">
                {no}
            </button>
        </li>;
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