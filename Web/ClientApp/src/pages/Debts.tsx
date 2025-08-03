import SimpleComponentsPage from "./SimpleComponentsPage";

const Debts = () => {
    return <SimpleComponentsPage
        title='Debts'
        apiPath='debts'
        editable={true}
    />;
};

export default Debts;