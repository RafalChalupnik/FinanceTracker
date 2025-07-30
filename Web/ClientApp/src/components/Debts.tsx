import React, { Component } from 'react';
import SimpleComponentsTable from "./SimpleComponentsTable";

export class Debts extends Component {
    static displayName = Debts.name;

    render() {
        return (
            <SimpleComponentsTable 
                apiPath={'debts'}
                editable={true}
            />
        );
    }
}
