import React from 'react';
import {FloatButton, List, Space} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {ArrowRightOutlined} from "@ant-design/icons";
import Money from "../components/money/Money";
import {Column, ExtendableTable} from "../components/table/ExtendableTable";

interface Transaction {
    key: string;
    date: Dayjs;
    debit: LedgerEntry | undefined;
    credit: LedgerEntry | undefined;
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
    const renderEntry = (entry: LedgerEntry | undefined) => (
        <>
            {entry?.componentId}
            {entry?.physicalAllocationId}
            <Money value={entry?.value} colorCoding={true} isInferred={false} />
        </>
    );
    
    return (
        <Space direction='horizontal'>
            {props.transaction.date.format('YYYY-MM-DD')}
            {renderEntry(props.transaction.debit)}
            <ArrowRightOutlined />
            {renderEntry(props.transaction.credit)}
        </Space>
    );
}

const data: Transaction[] = [
    {
        key: 't1',
        date: dayjs('2022-01-01'),
        debit: undefined,
        credit: {
            key: 'e1',
            componentId: 'c1',
            physicalAllocationId: 'p1',
            value: {
                amount: 100,
                currency: 'PLN',
                amountInMainCurrency: 100
            }
        }
    },
    {
        key: 't2',
        date: dayjs('2023-01-01'),
        debit: {
            key: 'e2',
            componentId: 'c2',
            physicalAllocationId: 'p2',
            value: {
                amount: -100,
                currency: 'CAD',
                amountInMainCurrency: -200
            }
        },
        credit: undefined
    },
    {
        key: 't3',
        date: dayjs('2024-01-01'),
        debit: {
            key: 'e3',
            componentId: 'c3',
            physicalAllocationId: 'p3',
            value: {
                amount: -50,
                currency: 'PLN',
                amountInMainCurrency: -50
            }
        },
        credit: {
            key: 'e4',
            componentId: 'c4',
            physicalAllocationId: 'p4',
            value: {
                amount: 50,
                currency: 'PLN',
                amountInMainCurrency: 50
            }
        }
    }
];

const columns: Column<Transaction>[] = [
    {
        key: 'date',
        title: 'Date',
        render: transaction => transaction.date.format('YYYY-MM-DD')
    },
    {
        key: 'from',
        title: 'From',
        render: transaction => transaction.debit?.componentId // TODO: Add physical alloc
    },
    {
        key: 'divider',
        title: '',
        render: _ => <ArrowRightOutlined />
    },
    {
        key: 'to',
        title: 'To',
        render: transaction => transaction.credit?.componentId // TODO: Add physical alloc
    },
];

const LedgerPage: React.FC = () => {
    return (
        <>
            <ExtendableTable rows={data} columns={columns}/>
            
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