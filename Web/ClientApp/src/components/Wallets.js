import React, { Component } from 'react';
import SummaryTable from "./SummaryTable";

export class Wallets extends Component {
    static displayName = Wallets.name;

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
            : <div>
                {this.state.data.wallets.map(wallet =>
                    <div>
                        <h1>{wallet.name}</h1>
                        <SummaryTable
                            data={wallet.data}
                            selectFunc={data => {return {
                                components: data.components,
                                summary: data.summary
                            }}} />
                    </div>
                )}
            </div>
            
        return (
            [content]
        );
    }

    async populateData() {
        const response = await fetch('wallets');
        const data = await response.json();
        this.setState({ data: data, loading: false });
    }
}
