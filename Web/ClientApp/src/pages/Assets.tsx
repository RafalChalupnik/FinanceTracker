import SimpleComponentsPage from "./SimpleComponentsPage";
import {deleteAssetsValues, getAssetsValueHistory, setAssetValue} from "../api/ValueHistoryApi";

const Assets = () => {
    return <SimpleComponentsPage
        title='Assets'
        getData={getAssetsValueHistory}
        editable={{
            setValue: setAssetValue,
            deleteValues: deleteAssetsValues
        }}
    />;
};

export default Assets;