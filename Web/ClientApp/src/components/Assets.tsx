import React, { Component } from 'react';
import SummaryTable, {SummaryTableRow} from "./SummaryTable";
import {getAssets} from '../ApiClient'
import { SummaryTableHeader } from './SummaryTable';
import {mapData} from "../SummaryTableMapper";

interface AssetsProps {}

interface AssetsState {
    headers: SummaryTableHeader[],
    data: SummaryTableRow[],
    loading: boolean
}

export class Assets extends Component<AssetsProps, AssetsState> {
    static displayName = Assets.name;
    
    state: AssetsState = {
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
                onUpdate={this.updateAsset}
                onDelete={this.deleteEvaluations}
            />

        return (
            <div>
                <h1 id="tableLabel">Assets</h1>
                {content}
            </div>
        );
    }
    
    updateAsset = async (id: string, date: Date, value: number) => {
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

    deleteEvaluations = async (date: Date) => {
        const response = await fetch("assets/" + date, {
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
        const response = await getAssets();
        
        let headers: SummaryTableHeader[] = response.headers
        let data = mapData(headers, response.data)
        
        this.setState({ headers: headers, data: data, loading: false });
    }
}
