import React, { Component } from 'react';
import SummaryTable from "./SummaryTable";

export class Assets extends Component {
    static displayName = Assets.name;

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
                selectFunc={data => [...data.assets, data.summary]} />

        return (
            <div>
                <h1 id="tableLabel">Assets</h1>
                {content}
            </div>
        );
    }

    async populateData() {
        const response = await fetch('assets');
        const data = await response.json();
        this.setState({ data: data.data, loading: false });
    }
}
