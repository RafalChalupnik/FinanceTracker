import {Component} from "react";
import SummaryTable from "./SummaryTable";

export class PortfolioSummary extends Component {
    static displayName = PortfolioSummary.name;

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
            : <SummaryTable 
                data={this.state.data}
                selectFunc={data => [data.wallets, data.assets, data.debts, data.summary]} />

        return (
            <div>
                <h1 id="tableLabel">Portfolio</h1>
                {content}
            </div>
        );
    }

    async populateData() {
        const response = await fetch('portfolio/summary');
        const data = await response.json();
        console.log(data.data[0])
        this.setState({ data: data.data, loading: false });
    }
}