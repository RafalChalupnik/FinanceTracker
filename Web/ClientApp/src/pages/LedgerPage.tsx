import React from 'react';
import {FloatButton, List, Space} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {ArrowRightOutlined} from "@ant-design/icons";
import Money from "../components/money/Money";

interface Transaction {
    key: string;
    date: Dayjs;
    entries: LedgerEntry[];
}

interface LedgerEntry {
    key: string;
    componentId: string;
    physicalAllocationId: string;
    value: MoneyDto
}

interface LedgerEntryFormProps {
    transaction: Transaction;
}

const LedgerEntryForm: React.FC<LedgerEntryFormProps> = (props) => {
    let debit = props.transaction.entries.filter(entry => entry.value.amount < 0);
    let credit = props.transaction.entries.filter(entry => entry.value.amount > 0);
    
    return (
        <Space direction='horizontal'>
            {props.transaction.date.format('YYYY-MM-DD')}
            {debit.map(entry => (
                <>
                    {entry.componentId}
                    {entry.physicalAllocationId}
                    <Money value={entry.value} colorCoding={true} isInferred={false} />
                </>
            ))}
            <ArrowRightOutlined />
            {credit.map(entry => (
                <>
                    {entry.componentId}
                    {entry.physicalAllocationId}
                    <Money value={entry.value} colorCoding={true} isInferred={false} />
                </>
            ))}
        </Space>
    );
}

const data: Transaction[] = [
    {
        key: 't1',
        date: dayjs('2022-01-01'),
        entries: [
            {
                key: 'e1',
                componentId: 'c1',
                physicalAllocationId: 'p1',
                value: {
                    amount: 100,
                    currency: 'PLN',
                    amountInMainCurrency: 100
                }
            }
        ]
    },
    {
        key: 't2',
        date: dayjs('2023-01-01'),
        entries: [
            {
                key: 'e2',
                componentId: 'c2',
                physicalAllocationId: 'p2',
                value: {
                    amount: -100,
                    currency: 'CAD',
                    amountInMainCurrency: -200
                }
            }
        ]
    },
    {
        key: 't3',
        date: dayjs('2024-01-01'),
        entries: [
            {
                key: 'e3',
                componentId: 'c3',
                physicalAllocationId: 'p3',
                value: {
                    amount: -50,
                    currency: 'PLN',
                    amountInMainCurrency: -50
                }
            },
            {
                key: 'e4',
                componentId: 'c4',
                physicalAllocationId: 'p4',
                value: {
                    amount: 50,
                    currency: 'PLN',
                    amountInMainCurrency: 50
                }
            }
        ]
    }
];

const LedgerPage: React.FC = () => {
    return (
        <>
            <List
                header={<div>Header</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <LedgerEntryForm transaction={item} />
                    </List.Item>
                )}
            />
            <FloatButton onClick={() => console.log('onClick')} />
        </>
    );
}

export default LedgerPage;