import SimpleComponentsPage from "./SimpleComponentsPage";

const PortfolioSummary = () => {
    return <SimpleComponentsPage
        apiPath={'portfolio/summary'}
        editable={false}
    />;
};

export default PortfolioSummary;
