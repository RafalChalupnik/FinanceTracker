import React, { Component } from 'react';
import SummaryTable, {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {getDebts} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";

interface DebtsProps {}

interface DebtsState {
    headers: SummaryTableHeader[],
    data: SummaryTableRow[],
    loading: boolean
}

export class Debts extends Component<DebtsProps, DebtsState> {
    static displayName = Debts.name;

    state: DebtsState = {
        headers: [],
        data: [],
        loading: true
    }

    componentDidMount() {
        this.populateData();
    }

    render() {
        let content = this.state.loading
            ? <p><em>Loading...</em></p>
            : <SummaryTable
                headers={this.state.headers}
                data={this.state.data}
                isEditable={true}
                onUpdate={this.updateDebt}
                onDelete={this.deleteEvaluations}
            />

        return (
            <>
                {content}
            </>
        );
    }

    updateDebt = async (id: string, date: string, value: number) => {
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

    deleteEvaluations = async (date: Date) => {
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
        const response = await getDebts();

        let headers: SummaryTableHeader[] = response.headers
        let data = mapData(response.data)

        this.setState({ headers: headers, data: data, loading: false });
    }
}
