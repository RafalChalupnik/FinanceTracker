import React, { Component } from 'react';
import SummaryTable from "./SummaryTable";

export class WalletsSummary extends Component {
  static displayName = WalletsSummary.name;

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
            selectFunc={data => [...data.wallets, data.summary]} />
    
    return (
      <div>
        <h1 id="tableLabel">Wallets</h1>
          {content}
      </div>
    );
  }

  async populateData() {
    const response = await fetch('portfolio/wallets');
    const data = await response.json();
    this.setState({ data: data.data, loading: false });
  }
}
