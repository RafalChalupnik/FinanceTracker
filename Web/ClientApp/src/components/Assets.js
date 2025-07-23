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
                selectFunc={data => {return {
                    components: data.assets,
                    summary: data.summary
                }}}
                isEditable="true"
                onUpdate={this.updateAsset}
            />

        return (
            <div>
                <h1 id="tableLabel">Assets</h1>
                {content}
            </div>
        );
    }
    
    updateAsset = async (id, date, value) => {
        const response = await fetch("assets/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                date: date,
                value: value
            }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await this.populateData();
    }

    populateData = async () => {
        const response = await fetch('assets');
        const data = await response.json();
        this.setState({ data: data.data, loading: false });
    }
}
