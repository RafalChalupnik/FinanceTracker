import React, {Component} from "react";
import SimpleComponentsTable from "./SimpleComponentsTable";

export class PortfolioSummary extends Component {
    static displayName = PortfolioSummary.name;

    render() {
        return (
            <SimpleComponentsTable 
                apiPath={'portfolio/summary'}
                editable={false}
            />
        );
    }
}