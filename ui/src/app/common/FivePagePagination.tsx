import * as React from "react";

import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';

interface FivePagePaginationProps {
    page: number
    total: number
}

class FivePagePagination extends React.Component<FivePagePaginationProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const range = FivePagePagination.getDisplayedPages(this.props.page, this.props.total)
        const url = "#";
        const first = range[0];
        const second = range[1];
        const third = range[2];
        const fourth = range[3];
        const fifth = range[4];
        return (
            <Pagination aria-label="Page navigation example">
                <PaginationItem disabled={range.includes(this.props.page)}>
                    <PaginationLink first href={url}/>
                </PaginationItem>
                <PaginationItem disabled={range.includes(this.props.page)}>
                    <PaginationLink previous href="#"/>
                </PaginationItem>
                <PaginationItem active>
                    <PaginationLink href="#">
                        {first}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">
                        {second}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">
                        {third}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">
                        {fourth}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">
                        {fifth}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={range.includes(this.props.page)}>
                    <PaginationLink next href="#"/>
                </PaginationItem>
                <PaginationItem disabled={range.includes(this.props.page)}>
                    <PaginationLink last href="#" />
                </PaginationItem>
            </Pagination>
        );
    }

    private static get(me: number, current: number, total: number) {
        const range = FivePagePagination.getDisplayedPages(current, total);
        return range[me];
    }

    private static getDisplayedPages(current: number, total: number) : Array<number> {
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