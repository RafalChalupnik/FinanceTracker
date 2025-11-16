import React from 'react';
import {FloatButton, List, Popconfirm, Space, Typography} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {ArrowRightOutlined, DeleteOutlined} from "@ant-design/icons";
import Money from "../components/money/Money";
import {Column, ExtendableTable} from "../components/table/ExtendableTable";
import MoneyForm from "../components/money/MoneyForm";

const { Text } = Typography;

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

const renderComponent = (entry: LedgerEntry | undefined) => {
    if (entry === undefined ) {
        return (<></>);
    }
    
    let physicalAllocationText = entry.physicalAllocationId !== undefined
        ? (<Text style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{entry.physicalAllocationId}</Text>)
        : (<></>);
    
    return (
        <Space direction={"vertical"}>
            <Text>{entry.componentId}</Text>
            {physicalAllocationText}
        </Space>
    );
}

const columns: Column<Transaction>[] = [
    {
        key: 'date',
        title: 'Date',
        render: transaction => transaction.date.format('YYYY-MM-DD')
    },
    {
        key: 'from-component',
        title: 'From',
        render: transaction => renderComponent(transaction.debit)
    },
    {
        key: 'from-value',
        title: '',
        render: transaction => (
            <Money value={transaction.debit?.value} colorCoding={true} isInferred={false} />
        ),
        editable: {
            renderEditable: (transaction, closeCallback) => (
                <MoneyForm
                    initialValue={transaction.debit?.value}
                    onSave={function(value: MoneyDto, physicalAllocationId?: string): (void | Promise<void>) {
                        closeCallback();
                    }}
                    onCancel={function(): void {
                        closeCallback();
                    } }/>
            )
        }
    },
    {
        key: 'divider',
        title: '',
        render: _ => <ArrowRightOutlined />
    },
    {
        key: 'to-component',
        title: 'To',
        render: transaction => renderComponent(transaction.credit)
    },
    {
        key: 'to-value',
        title: '',
        render: transaction => (
            <Money value={transaction.credit?.value} colorCoding={true} isInferred={false} />
        ),
        editable: {
            renderEditable: (transaction, closeCallback) => (
                <MoneyForm 
                    initialValue={transaction.credit?.value} 
                    onSave={function(value: MoneyDto, physicalAllocationId?: string): (void | Promise<void>) {
                        
                    }} 
                    onCancel={function(): void {
                        
                    } }/>
            )
        }
    },
    {
        key: 'delete',
        title: '',
        fixed: 'right',
        render: transaction => (
            <Popconfirm
                title='Sure to delete?'
                okText={'Yes'}
                cancelText={'No'}
                okButtonProps={{ danger: true }}
                // onConfirm={async () => await onDeleteRow(row)}
            >
                <DeleteOutlined />
            </Popconfirm>
        )
    }
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