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
    const [isLoading, setIsLoading] = useState(true)
    const [wallet, setWallet] = useState<EntityTableDto<WalletComponentsValueHistoryRecordDto> | undefined>(undefined);
    const [physicalAllocations, setPhysicalAllocations] = useState<OrderableEntityDto[]>([]);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const walletsResponse = await getWalletComponentsValueHistory(props.walletId, granularity, from, to)
        setWallet(walletsResponse)
        
        const physicalAllocationsResponse = await getPhysicalAllocations();
        setPhysicalAllocations(physicalAllocationsResponse);
        
        setIsLoading(false)
    }

    useEffect(() => {
        populateData()
    }, [])

    const updateComponent = async (id: string, date: string, value: MoneyDto, physicalAllocationId?: string) => {
        await setWalletComponentValue(id, date, value, physicalAllocationId);
        await populateData();
    }

    const deleteEvaluations = async (walletId: string, date: string) => {
        await deleteWalletValues(walletId, date);
        await populateData();
    }
    
    let extra = wallet?.rows !== undefined && !wallet.rows.every(row => row.target === null)
        ? <WalletTargetChart data={wallet.rows}/>
        : undefined;

    return isLoading
        ? <p><em>Loading...</em></p>
        : (
            <EmptyConfig enabled={wallet?.columns.length === 0}>
                <EditableMoneyComponent
                    title={props.name}
                    rows={wallet!.rows}
                    columns={wallet!.columns}
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
                        onUpdate: updateComponent,
                        onDelete: date => deleteEvaluations(props.walletId, date),
                    }}
                    refreshData={populateData}
                    showInferredValues={true}
                    buildExtraColumns={granularity => [
                        buildTargetColumn(
                            granularity,
                            async (date, value) => {
                                await setWalletTarget(props.walletId, date, value);
                                await populateData();
                            }
                        )
                    ]}
                    extra={extra}
                    physicalAllocations={physicalAllocations}
                />
            </EmptyConfig>
        );
}

export default Wallet;