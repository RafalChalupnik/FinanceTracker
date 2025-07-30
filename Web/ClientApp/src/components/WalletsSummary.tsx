import SimpleComponentsTable from "./SimpleComponentsTable";

const WalletsSummary = () => {
    return <SimpleComponentsTable
        apiPath={'portfolio/wallets'}
        editable={false}
    />;
};

export default WalletsSummary;