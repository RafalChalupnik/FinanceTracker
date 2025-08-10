import React, {FC, useEffect, useState} from 'react';
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import EmptyConfig from "../components/EmptyConfig";
import {Dayjs} from 'dayjs';
import {buildTargetColumn} from "../components/ColumnBuilder";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteWalletValues, getWalletComponentsValueHistory,
    setWalletComponentValue, setWalletTarget
} from "../api/value-history/Client";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {EntityTableDto, WalletComponentsValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Typography} from "antd";

const {Title} = Typography;

interface TargetChartProps {
    data: WalletComponentsValueHistoryRecordDto[]
}

const TargetChart: FC<TargetChartProps> = (props) => {
    const chartLineColors = [
        '#1890ff',
        '#52c41a'
    ];
    
    let series = [
        {
            name: 'Target (%)',
            data: props.data
                .filter(dataPoint => dataPoint.target?.percentage !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.target?.percentage
                    }
                })
        }
    ]

    return (
        <>
            <Title level={5}>Target %</Title>
            <ResponsiveContainer width="100%" height={300} style={{padding: '16px'}}>
                <LineChart width={500} height={300} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                    <YAxis dataKey="value" />
                    <Tooltip/>
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
        </>
    );
}

interface WalletProps {
    walletId: string,
    name: string
}

const Wallet: FC<WalletProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallet, setWallet] = useState<EntityTableDto<WalletComponentsValueHistoryRecordDto> | undefined>(undefined);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getWalletComponentsValueHistory(props.walletId, granularity, from, to)
        setWallet(response)
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
    
    let extra = wallet?.rows !== undefined && !wallet.rows.every(row => row.target === undefined)
        ? <TargetChart data={wallet.rows}/>
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
                            }
                        },
                        onUpdate: updateComponent,
                        onDelete: date => deleteEvaluations(props.walletId, date),
                    }}
                    refreshData={populateData}
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
                />
            </EmptyConfig>
        );
}

export default Wallet;