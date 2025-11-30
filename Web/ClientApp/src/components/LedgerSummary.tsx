import {Space, Table, Typography} from "antd";
import React, {useEffect} from "react";
import {ColumnsType} from "antd/es/table";
import Money from "./money/Money";
import {getComponentValues, getPhysicalAllocationsValues, getTransactions} from "../api/ledger/Client";
import {NameValueDto} from "../api/ledger/DTOs/NameValueDto";

const {Title} = Typography;

const LedgerSummary: React.FC = () => {
    const [components, setComponents] = React.useState<NameValueDto[]>([]);
    const [physicalAllocations, setPhysicalAllocations] = React.useState<NameValueDto[]>([]);
    
    const populateData = async () => {
        const components = await getComponentValues();
        setComponents(components);

        const physicalAllocations = await getPhysicalAllocationsValues();
        setPhysicalAllocations(physicalAllocations);
    }
    
    useEffect(() => {
        populateData();
        // eslint-disable-next-line
    }, []);
    
    let columns: ColumnsType<NameValueDto> = [
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
                dataSource={components}
                columns={columns}
                pagination={false}
                rowKey='key'
                scroll={{ x: 'max-content' }}
            />
            <Title level={5}>Physical Allocations</Title>
            <Table
                bordered
                dataSource={physicalAllocations}
                columns={columns}
                pagination={false}
                rowKey='key'
                scroll={{ x: 'max-content' }}
            />
        </Space>
    );
}

export default LedgerSummary;