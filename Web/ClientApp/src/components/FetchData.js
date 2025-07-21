import React, { Component } from 'react';
import Money from "./Money";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { portfolio: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  static renderPortfolioTable(portfolio) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th/>
            {portfolio.data[0].wallets.map(wallet =>
                <th colSpan="3">{wallet.name}</th>
            )}
            <th colSpan="3">Summary</th>
          </tr>
          <tr>
            <th style={{ borderRight: '1px solid black' }}>Date</th>
            {portfolio.data[0].wallets.map(wallet =>
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
          {portfolio.data.map(data =>
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
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderPortfolioTable(this.state.portfolio);

    return (
      <div>
        <h1 id="tableLabel">Portfolio</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('portfolio/summary');
    const data = await response.json();
    this.setState({ portfolio: data, loading: false });
  }
}
