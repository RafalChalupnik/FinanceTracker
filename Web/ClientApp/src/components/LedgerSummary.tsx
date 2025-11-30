import {Space, Table, Typography} from "antd";
import React from "react";
import {ColumnsType} from "antd/es/table";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import Money from "./money/Money";

const {Title} = Typography;

interface ComponentValue {
    name: string,
    value: MoneyDto
}

let values: ComponentValue[] = [
    {
        name: 'CompA',
        value: {
            amount: 123.45,
            currency: 'PLN',
            amountInMainCurrency: 123.45
        }
    },
    {
        name: 'CompB',
        value: {
            amount: -456.78,
            currency: 'PLN',
            amountInMainCurrency: -456.78
        }
    },
    {
        name: 'CompC',
        value: {
            amount: 420.69,
            currency: 'EUR',
            amountInMainCurrency: 2137.45
        }
    }
]

// ---

const LedgerSummary: React.FC = () => {
    let columns: ColumnsType<ComponentValue> = [
        {
            key: 'component',
            title: 'Component',
            render: value => value.name
        },
        {
            key: 'value',
            title: 'Value',
            render: value => <Money value={value.value} colorCoding={true} isInferred={false}/>
        }
    ]
    
    return (
        <Space direction="vertical">
            <Title level={5}>Components</Title>
            <Table
                bordered
                dataSource={values}
                columns={columns}
                pagination={false}
                rowKey='key'
                scroll={{ x: 'max-content' }}
            />
            <Title level={5}>Physical Allocations</Title>
            <Table
                bordered
                dataSource={values}
                columns={columns}
                pagination={false}
                rowKey='key'
                scroll={{ x: 'max-content' }}
            />
        </Space>
    );
}

export default LedgerSummary;