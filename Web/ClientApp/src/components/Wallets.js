import React, { Component } from 'react';
import SummaryTable from "./SummaryTable";

export class Wallets extends Component {
    static displayName = Wallets.name;

    constructor(props) {
        super(props);
        this.state = { data: [], loading: true };
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
                            selectFunc={data => data}
                            isEditable="true"
                            onUpdate={this.updateComponent}/>
                    </div>
                )}
            </div>
            
        return (
            [content]
        );
    }

    updateComponent = async (id, date, value) => {
        const response = await fetch("wallets/components/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: date,
                value: value
            }),
        });
        
        console.log(response)       

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await this.populateData();
    }

    populateData = async () => {
        const response = await fetch('wallets');
        const data = await response.json();
        this.setState({ data: data, loading: false });
    }
}
