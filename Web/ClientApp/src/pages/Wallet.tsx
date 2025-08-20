import React, {FC, useEffect, useState} from 'react';
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from 'dayjs';
import {buildTargetColumn} from "../components/table/ColumnBuilder";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteWalletValues, getWalletComponentsValueHistory,
    setWalletComponentValue, setWalletTarget
} from "../api/value-history/Client";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {EntityTableDto, WalletComponentsValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import WalletTargetChart from "../components/charts/custom/WalletTargetChart";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import { getPhysicalAllocations } from '../api/configuration/Client';

interface WalletProps {
    walletId: string,
    name: string
}

const Wallet: FC<WalletProps> = (props) => {
    const [physicalAllocations] = useState<OrderableEntityDto[]>([]);

    const getData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => 
        await getWalletComponentsValueHistory(props.walletId, granularity, from, to)

    const buildExtra = (data: EntityTableDto<WalletComponentsValueHistoryRecordDto>) =>  data?.rows !== undefined && !data.rows.every(row => row.target === null)
        ? <WalletTargetChart data={data.rows}/>
        : undefined;

    return (
        <EditableMoneyComponent
            title={props.name}
            getData={getData}
            editable={{
                createEmptyRow: (date, columns) => {
                    return {
                        key: date.format("YYYY-MM-DD"),
                        entities: columns.map(_ => undefined),
                        summary: undefined,
                        target: undefined,
                        newEntry: true
                    }
                },
                onUpdate: setWalletComponentValue,
                onDelete: date => deleteWalletValues(props.walletId, date),
            }}
            showInferredValues={true}
            buildExtraColumns={(granularity, refreshCallback) => [
                buildTargetColumn(
                    granularity,
                    async (date, value) => {
                        await setWalletTarget(props.walletId, date, value);
                        await refreshCallback();
                    }
                )
            ]}
            extra={buildExtra}
            physicalAllocations={physicalAllocations}
        />
    );
}

export default Wallet;