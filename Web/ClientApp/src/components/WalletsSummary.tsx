import React, { Component } from 'react';
import SimpleComponentsTable from "./SimpleComponentsTable";

export class WalletsSummary extends Component {
    static displayName = WalletsSummary.name;

    render() {
        return (
            <SimpleComponentsTable
                apiPath={'portfolio/wallets'}
                editable={false}
            />
        );
    }
}
