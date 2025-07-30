import SimpleComponentsTable from "./SimpleComponentsTable";

const Assets = () => {
    return <SimpleComponentsTable
        apiPath={'assets'}
        editable={true}
    />;
};

export default Assets;