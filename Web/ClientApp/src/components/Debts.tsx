import SimpleComponentsTable from "./SimpleComponentsTable";

const Debts = () => {
    return <SimpleComponentsTable
        apiPath={'debts'}
        editable={true}
    />;
};

export default Debts;