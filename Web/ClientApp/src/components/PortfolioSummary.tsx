import {Component} from "react";
import SummaryTable, {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {getAssets, getPortfolioSummary} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";

interface PortfolioSummaryProps {}

interface PortfolioSummaryState {
    headers: SummaryTableHeader[],
    data: SummaryTableRow[],
    loading: boolean
}

export class PortfolioSummary extends Component<PortfolioSummaryProps, PortfolioSummaryState> {
    static displayName = PortfolioSummary.name;

    state: PortfolioSummaryState = {
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
                isEditable={false}
            />

        return (
            <>
                {content}
            </>
        );
    }

    async populateData() {
        const response = await getPortfolioSummary();

        let headers: SummaryTableHeader[] = response.headers
        let data = mapData(response.data)

        this.setState({ headers: headers, data: data, loading: false });
    }
}