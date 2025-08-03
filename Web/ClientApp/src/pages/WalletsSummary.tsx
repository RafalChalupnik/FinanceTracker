import SimpleComponentsPage from "./SimpleComponentsPage";

const WalletsSummary = () => {
    return <SimpleComponentsPage
        title='Wallets Summary'
        apiPath='portfolio/wallets'
        editable={false}
    />;
};

export default WalletsSummary;