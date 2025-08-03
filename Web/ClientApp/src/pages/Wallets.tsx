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
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const chartLineColors = ['#1890ff', '#52c41a', '#f5222d', '#fa8c16', '#722ed1', '#13c2c2'];


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
                    {
                        let series = wallet.headers.map((header, index) => {
                            return {
                                name: header.name,
                                data: wallet.data.map(dataPoint => {
                                    return {
                                        date: dataPoint.date,
                                        value: dataPoint.components[index]?.value.amountInMainCurrency ?? 0
                                    }
                                })
                            }
                        })
                        
                        return (
                            <Space direction="vertical">
                                <EditableMoneyTable
                                    title={wallet.name}
                                    rows={wallet.data}
                                    columns={wallet.headers}
                                    editable={{
                                        onUpdate: updateComponent,
                                        onDelete: date => deleteEvaluations(wallet.id, date),
                                    }}
                                />
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart width={500} height={300}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                                        <YAxis dataKey="value" />
                                        <Tooltip />
                                        <Legend />
                                        {series.map((s, idx) => (
                                            <Line 
                                                dataKey="value" 
                                                data={s.data} 
                                                name={s.name} 
                                                key={s.name}
                                                stroke={chartLineColors[idx % chartLineColors.length]}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Space>
                        );
                    }
                    )}
                </Space>
            </EmptyConfig>
        );
}

export default Wallets;