import React, {FC, useEffect, useState} from 'react';
import {Space} from "antd";
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from 'dayjs';
import {buildTargetColumn} from "../components/ColumnBuilder";
import {
    WalletComponentsTableDto,
} from "../api/value-history/DTOs/EntityTableDto";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteWalletValues,
    getWalletsComponentsValueHistory,
    setWalletComponentValue, setWalletTarget
} from "../api/value-history/Client";
import {MoneyDto} from "../api/value-history/DTOs/Money";

interface WalletsProps {
    walletId: string
}

const Wallets: FC<WalletsProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallets, setWallets] = useState([] as WalletComponentsTableDto[]);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getWalletsComponentsValueHistory(granularity, from, to)
        // TODO: Pull only one wallet
        setWallets([response.wallets.find(wallet => wallet.id === props.walletId)!])
        setIsLoading(false)
    }

    useEffect(() => {
        populateData()
    }, [])

    const updateComponent = async (id: string, date: string, value: MoneyDto) => {
        await setWalletComponentValue(id, date, value);
        await populateData();
    }

    const deleteEvaluations = async (walletId: string, date: string) => {
        await deleteWalletValues(walletId, date);
        await populateData();
    }

    return isLoading
        ? <p><em>Loading...</em></p>
        : (
            <EmptyConfig enabled={wallets.length === 0}>
                <Space direction="vertical">
                    {wallets.map(wallet => {
                            return (
                                <EditableMoneyComponent
                                    title={wallet.name}
                                    rows={wallet.rows}
                                    columns={wallet.columns}
                                    editable={{
                                        createEmptyRow: (date, columns) => {
                                            return {
                                                key: date.format("YYYY-MM-DD"),
                                                entities: columns.map(_ => undefined),
                                                summary: undefined,
                                                target: undefined,
                                            }
                                        },
                                        onUpdate: updateComponent,
                                        onDelete: date => deleteEvaluations(wallet.id, date),
                                    }}
                                    refreshData={populateData}
                                    buildExtraColumns={granularity => [
                                        buildTargetColumn(
                                            granularity,
                                            async (date, value) => {
                                                await setWalletTarget(wallet.id, date, value);
                                                await populateData();
                                            }
                                        )
                                    ]}
                                />
                        );
                    }
                    )}
                </Space>
            </EmptyConfig>
        );
}

export default Wallets;