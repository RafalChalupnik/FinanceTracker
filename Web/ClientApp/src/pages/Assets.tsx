import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, deleteAssetsValues, getAssetsValueHistory, setAssetValue} from "../api/ValueHistoryApi";

const Assets = () => {
    return <SimpleComponentsPage
        title='Assets'
        defaultGranularity={DateGranularity.Day}
        getData={getAssetsValueHistory}
        editable={{
            setValue: setAssetValue,
            deleteValues: deleteAssetsValues
        }}
    />;
};

export default Assets;