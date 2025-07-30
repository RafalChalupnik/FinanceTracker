import SimpleComponentsTable from "./SimpleComponentsTable";

const PortfolioSummary = () => {
    return <SimpleComponentsTable
        apiPath={'portfolio/summary'}
        editable={false}
    />;
};

export default PortfolioSummary;
