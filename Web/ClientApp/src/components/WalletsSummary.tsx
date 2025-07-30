import React, { Component } from 'react';
import SummaryTable, {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {getWalletsSummary} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";

interface WalletsSummaryProps {}

interface WalletsSummaryState {
    headers: SummaryTableHeader[],
    data: SummaryTableRow[],
    loading: boolean
}

export class WalletsSummary extends Component<WalletsSummaryProps, WalletsSummaryState> {
  static displayName = WalletsSummary.name;

    state: WalletsSummaryState = {
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
        />

      return (
          <>
              {content}
          </>
      );
  }

  async populateData() {
      const response = await getWalletsSummary();

      let headers: SummaryTableHeader[] = response.headers
      let data = mapData(response.data)

      this.setState({ headers: headers, data: data, loading: false });
  }
}
