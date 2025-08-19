import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteAssetsValues,
    getAssetsValueHistory,
    setAssetValue
} from "../api/value-history/Client";
import React, {useEffect, useState} from "react";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {MoneyDto} from "../api/value-history/DTOs/Money";

const Assets = () => {
    const [data, setData] = useState({
        headers: [] as EntityColumnDto[],
        rows: [] as ValueHistoryRecordDto[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getAssetsValueHistory(granularity, from, to);

        setData({
            headers: response.columns,
            rows: response.rows
        });
    }

    useEffect(() => {
        populateData();
    }, []);

    const updateEntity = async (id: string, date: string, value: MoneyDto) => {
        await setAssetValue(id, date, value)
        await populateData()
    }

    const deleteValues = async (date: string) => {
        await deleteAssetsValues(date)
        await populateData()
    }

    return (
        <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title='Assets'
                rows={data.rows}
                columns={data.headers}
                refreshData={populateData}
                showInferredValues={true}
                defaultGranularity={DateGranularity.Day}
                editable={{
                    createEmptyRow: (date, columns) => {
                        return {
                            key: date.format("YYYY-MM-DD"),
                            entities: columns.map(_ => undefined),
                            summary: undefined
                        }
                    },
                    onUpdate: updateEntity,
                    onDelete: deleteValues
                }}
            />
        </EmptyConfig>
    );
};

export default Assets;