import SimpleComponentsPage from "./SimpleComponentsPage";

const WalletsSummary = () => {
    return <SimpleComponentsPage
        apiPath={'portfolio/wallets'}
        editable={false}
    />;
};

export default WalletsSummary;