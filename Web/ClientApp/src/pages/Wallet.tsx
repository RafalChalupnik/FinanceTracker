import React, {FC, useState} from 'react';
import {Dayjs} from 'dayjs';
import {buildComponentsColumns, buildTargetColumn} from "../components/table/ColumnBuilder";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteWalletValues, getWalletComponentsValueHistory, setWalletComponentValue, setWalletTarget
} from "../api/value-history/Client";
import {
    EntityColumnDto,
    EntityTableDto, ValueHistoryRecordDto,
    WalletComponentsValueHistoryRecordDto
} from "../api/value-history/DTOs/EntityTableDto";
import WalletTargetChart from "../components/charts/custom/WalletTargetChart";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import {ColumnGroup} from "../components/table/ExtendableTable";

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

    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            true,
            async (entityId, date, value) => {
                await setWalletComponentValue(entityId, date, value);
                await updateCallback();
            }
        )
    }

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
                onDelete: date => deleteWalletValues(props.walletId, date),
            }}
            buildComponentColumns={buildComponentColumns}
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