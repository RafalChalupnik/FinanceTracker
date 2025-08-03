import React, {FC, useEffect, useState} from 'react';
import {Space} from "antd";
import EditableMoneyTable from "../components/EditableMoneyTable";
import {
    deleteWalletValues,
    getWalletsComponentsValueHistory,
    MoneyDto,
    setWalletComponentValue,
    WalletValueHistory
} from "../api/ValueHistoryApi";
import EmptyConfig from "../components/EmptyConfig";

interface WalletsProps {}

const Wallets: FC<WalletsProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallets, setWallets] = useState([] as WalletValueHistory[]);

    const populateData = async () => {
        const wallets = await getWalletsComponentsValueHistory()
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
                    {wallets.map(wallet =>
                        <EditableMoneyTable
                            title={wallet.name}
                            rows={wallet.data}
                            columns={wallet.headers}
                            editable={{
                                onUpdate: updateComponent,
                                onDelete: date => deleteEvaluations(wallet.id, date),
                            }}
                        />
                    )}
                </Space>
            </EmptyConfig>
        );
}

export default Wallets;