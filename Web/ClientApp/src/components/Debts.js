import React, { Component } from 'react';
import SummaryTable from "./SummaryTable";

export class Debts extends Component {
    static displayName = Debts.name;

    constructor(props) {
        super(props);
        this.state = { portfolio: [], loading: true };
    }

    componentDidMount() {
        this.populateData();
    }

    render() {
        let content = this.state.loading
            ? <p><em>Loading...</em></p>
            : <SummaryTable
                data={this.state.data}
                selectFunc={data => {return {
                    components: data.debts,
                    summary: data.summary
                }}}
            />

        return (
            <div>
                <h1 id="tableLabel">Debts</h1>
                {content}
            </div>
        );
    }

    async populateData() {
        const response = await fetch('debts');
        const data = await response.json();
        this.setState({ data: data.data, loading: false });
    }
}
