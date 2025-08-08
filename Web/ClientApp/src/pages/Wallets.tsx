import React, {FC, useEffect, useState} from 'react';
import {Button, Input, InputNumber, Space, Typography} from "antd";
import EditableMoneyComponent from "../components/EditableMoneyComponent";
import {
    DateGranularity,
    deleteWalletValues,
    getWalletsComponentsValueHistory,
    MoneyDto,
    setWalletComponentValue, setWalletTarget, ValueHistoryRecord,
    WalletComponentsValueHistory
} from "../api/ValueHistoryApi";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from 'dayjs';
import {EditableColumn} from "../components/EditableTable";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

const { Text } = Typography;

interface WalletsProps {
}

const Wallets: FC<WalletsProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallets, setWallets] = useState([] as WalletComponentsValueHistory[]);
    const [editingTargetValue, setEditingTargetValue] = useState(0);

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

    const formatAmount = (amount: number) =>
        new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        }).format(amount)
    
    const buildTargetColumns = (walletId: string): EditableColumn<ValueHistoryRecord>[] => [
        {
            title: 'Target',
            key: 'target',
            dataIndex: ['target'],
            fixed: 'right',
            render: record => record.target === null ? '-' : (
                <Space direction='vertical'>
                    <Space direction={"vertical"}>
                        {`${record.target?.percentage}%`}
                        <Text disabled>{formatAmount(record.target?.targetInMainCurrency ?? 0)}</Text>
                    </Space>
                </Space>
            ),
            editable: {
                renderEditableCell: (record, initialValue, close) => {
                    const handleSave = async () => {
                        await setWalletTarget(walletId, record.date, editingTargetValue)
                        await populateData()
                        close();
                    }

                    return (
                        <Space direction='horizontal'>
                            <InputNumber
                                value={record.target?.targetInMainCurrency ?? 0}
                                onChange={(e) => setEditingTargetValue(e?.valueOf() ?? 0)}
                                onPressEnter={handleSave}
                                onBlur={handleSave}
                                // autoFocus
                            />
                            <Button
                                icon={<SaveOutlined/>}
                                onClick={handleSave}
                            />
                            <Button
                                icon={<CloseOutlined/>}
                                onClick={close}
                            />
                        </Space>
                    );
                },
                onUpdate: (record, _, value) => setWalletTarget(walletId, record.date, value)
            }
        },
    ]

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
                                    extraColumns={buildTargetColumns(wallet.id)}
                                />
                        );
                    }
                    )}
                </Space>
            </EmptyConfig>
        );
}

export default Wallets;