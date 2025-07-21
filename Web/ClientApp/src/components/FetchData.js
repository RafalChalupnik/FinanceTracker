import React, { Component } from 'react';

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
            <th>Date</th>
            {portfolio.data[0].wallets.map(wallet =>
                <>
                  <th>Value</th>
                  <th>Change</th>
                  <th>Cumulative Change</th>
                </>
            )}
            <th>Value</th>
            <th>Change</th>
            <th>Cumulative Change</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.data.map(data =>
            <tr key={data.date}>
              <td>{data.date}</td>
              {data.wallets.map(wallet =>
                  <>
                    <td style={{ textAlign: 'right' }}>{wallet.value} PLN</td>
                    <td style={{ textAlign: 'right' }}>{wallet.change} PLN</td>
                    <td style={{ textAlign: 'right' }}>{wallet.cumulativeChange} PLN</td>
                  </>
              )}
              <td style={{ textAlign: 'right' }}>{data.summary.value} PLN</td>
              <td style={{ textAlign: 'right' }}>{data.summary.change} PLN</td>
              <td style={{ textAlign: 'right' }}>{data.summary.cumulativeChange} PLN</td>
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
