import React, { Component } from 'react';
import SimpleComponentsTable from "./SimpleComponentsTable";

export class Assets extends Component {
    static displayName = Assets.name;
    
    render() {
        return (
            <SimpleComponentsTable 
                apiPath={'assets'}
                editable={true}
            />
        );
    }
}
