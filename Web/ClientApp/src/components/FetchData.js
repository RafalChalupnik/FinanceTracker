import React, { Component } from 'react';
import Money from "./Money";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { portfolio: [], loading: true };
  }

  componentDidMount() {
    this.populateData();
  }

  static renderPortfolioTable(response) {
    return (
        <table className="table table-striped" aria-labelledby="tableLabel">
          <thead>
          <tr>
            <th/>
            <th colSpan="3">Wallets</th>
            <th colSpan="3">Assets</th>
            <th colSpan="3">Debts</th>
            <th colSpan="3">Summary</th>
          </tr>
          <tr>
            <th style={{ borderRight: '1px solid black' }}>Date</th>
              <th>Value</th>
              <th>Change</th>
              <th style={{ borderRight: '1px solid black' }}>Cumulative</th>
              <th>Value</th>
              <th>Change</th>
              <th style={{ borderRight: '1px solid black' }}>Cumulative</th>
              <th>Value</th>
              <th>Change</th>
              <th style={{ borderRight: '1px solid black' }}>Cumulative</th>
            <th>Value</th>
            <th>Change</th>
            <th>Cumulative</th>
          </tr>
          </thead>
          <tbody>
          {response.data.map(data =>
              <tr key={data.date}>
                <td style={{ borderRight: '1px solid black' }}>{data.date}</td>
                  <td>
                      <Money amount={data.wallets.value} />
                  </td>
                  <td>
                      <Money amount={data.wallets.change} colorCoding="true"/>
                  </td>
                  <td style={{ borderRight: '1px solid black'}}>
                      <Money amount={data.wallets.cumulativeChange} colorCoding="true"/>
                  </td>
                  <td>
                      <Money amount={data.assets.value} />
                  </td>
                  <td>
                      <Money amount={data.assets.change} colorCoding="true"/>
                  </td>
                  <td style={{ borderRight: '1px solid black'}}>
                      <Money amount={data.assets.cumulativeChange} colorCoding="true"/>
                  </td>
                  <td>
                      <Money amount={data.debts.value} />
                  </td>
                  <td>
                      <Money amount={data.debts.change} colorCoding="true"/>
                  </td>
                  <td style={{ borderRight: '1px solid black'}}>
                      <Money amount={data.debts.cumulativeChange} colorCoding="true"/>
                  </td>
                <td>
                  <Money amount={data.summary.value} />
                </td>
                <td>
                  <Money amount={data.summary.change} colorCoding="true"/>
                </td>
                <td>
                  <Money amount={data.summary.cumulativeChange} colorCoding="true"/>
                </td>
              </tr>
          )}
          </tbody>
        </table>
    );
  }
  
  static renderWalletsTable(response) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th/>
            {response.data[0].wallets.map(wallet =>
                <th colSpan="3">{wallet.name}</th>
            )}
            <th colSpan="3">Summary</th>
          </tr>
          <tr>
            <th style={{ borderRight: '1px solid black' }}>Date</th>
            {response.data[0].wallets.map(wallet =>
                <>
                  <th>Value</th>
                  <th>Change</th>
                  <th style={{ borderRight: '1px solid black' }}>Cumulative</th>
                </>
            )}
            <th>Value</th>
            <th>Change</th>
            <th>Cumulative</th>
          </tr>
        </thead>
        <tbody>
          {response.data.map(data =>
            <tr key={data.date}>
              <td style={{ borderRight: '1px solid black' }}>{data.date}</td>
              {data.wallets.map(wallet =>
                  <>
                    <td>
                      <Money amount={wallet.value} />
                    </td>
                    <td>
                      <Money amount={wallet.change} colorCoding="true"/>
                    </td>
                    <td style={{ borderRight: '1px solid black'}}>
                      <Money amount={wallet.cumulativeChange} colorCoding="true"/>
                    </td>
                  </>
              )}
              <td>
                <Money amount={data.summary.value} />
              </td>
              <td>
                <Money amount={data.summary.change} colorCoding="true"/>
              </td>
              <td>
                <Money amount={data.summary.cumulativeChange} colorCoding="true"/>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let portfolio = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderPortfolioTable(this.state.portfolio);
      
    let wallets = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderWalletsTable(this.state.wallets);

    return (
      <div>
        <h1 id="tableLabel">Portfolio</h1>
          {portfolio}
          <h1>Wallets</h1>
          {wallets}
      </div>
    );
  }

  async populateData() {
    const portfolioResponse = await fetch('portfolio/summary');
    const portfolioData = await portfolioResponse.json();
    const walletsResponse = await fetch('portfolio/wallets');
    const walletsData = await walletsResponse.json();
    this.setState({ portfolio: portfolioData, wallets: walletsData, loading: false });
  }
}
