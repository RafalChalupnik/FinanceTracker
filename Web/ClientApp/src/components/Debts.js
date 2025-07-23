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
                isEditable="true"
                onUpdate={this.updateDebt}
                onDelete={this.deleteEvaluations}
            />

        return (
            <div>
                <h1 id="tableLabel">Debts</h1>
                {content}
            </div>
        );
    }

    updateDebt = async (id, date, value) => {
        const response = await fetch("debts/" + id, {
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

    deleteEvaluations = async (date) => {
        const response = await fetch("debts/" + date, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await this.populateData();
    }

    populateData = async () => {
        const response = await fetch('debts');
        const data = await response.json();
        this.setState({ data: data.data, loading: false });
    }
}
