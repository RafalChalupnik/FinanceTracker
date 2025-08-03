import SimpleComponentsPage from "./SimpleComponentsPage";

const PortfolioSummary = () => {
    return <SimpleComponentsPage
        title='Portfolio Summary'
        apiPath='portfolio/summary'
        editable={false}
    />;
};

export default PortfolioSummary;
