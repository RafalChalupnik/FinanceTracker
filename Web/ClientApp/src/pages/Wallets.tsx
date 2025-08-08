import React, {FC, useEffect, useState} from 'react';
import {Space} from "antd";
import EditableMoneyComponent from "../components/EditableMoneyComponent";
import {
    DateGranularity,
    deleteWalletValues,
    getWalletsComponentsValueHistory,
    MoneyDto,
    setWalletComponentValue, 
    setWalletTarget, 
    WalletComponentsValueHistory
} from "../api/ValueHistoryApi";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from 'dayjs';
import {buildTargetColumn} from "../components/ColumnBuilder";

interface WalletsProps {
}

const Wallets: FC<WalletsProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallets, setWallets] = useState([] as WalletComponentsValueHistory[]);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const wallets = await getWalletsComponentsValueHistory(granularity, from, to)
        setWallets(wallets)
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
                                    rows={wallet.data}
                                    columns={wallet.headers}
                                    editable={{
                                        onUpdate: updateComponent,
                                        onDelete: date => deleteEvaluations(wallet.id, date),
                                    }}
                                    refreshData={populateData}
                                    extraColumns={[
                                        buildTargetColumn((date, value) => setWalletTarget(wallet.id, date, value))
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