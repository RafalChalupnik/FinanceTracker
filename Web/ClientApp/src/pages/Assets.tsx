import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {deleteAssetsValues, getAssetsValueHistory, setAssetValue} from "../api/value-history/Client";

const Assets = () => {
    return <SimpleComponentsPage
        title='Assets'
        defaultGranularity={DateGranularity.Day}
        getData={getAssetsValueHistory}
        editable={{
            createEmptyRow: (date, columns) => {
                return {
                    key: date.format("YYYY-MM-DD"),
                    entities: columns.map(_ => undefined),
                    summary: undefined
                }
            },
            setValue: setAssetValue,
            deleteValues: deleteAssetsValues
        }}
    />;
};

export default Assets;