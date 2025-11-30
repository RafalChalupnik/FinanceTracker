import {Space, Table, Typography} from "antd";
import React from "react";
import {ColumnsType} from "antd/es/table";

const {Title} = Typography;

interface ComponentValue {
    name: string,
    value: number
}

let values: ComponentValue[] = [
    {
        name: 'CompA',
        value: 123.45
    },
    {
        name: 'CompB',
        value: 456.78
    },
    {
        name: 'CompC',
        value: 420.69
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
            render: value => value.value
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