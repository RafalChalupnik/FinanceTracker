import React, {useEffect} from 'react';
import {FloatButton, Popconfirm, Space, Table, Typography} from 'antd';
import {ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import Money from "../components/money/Money";
import {
    deleteTransaction,
    getTransactions, upsertTransaction
} from "../api/ledger/Client";
import {LedgerEntryDto, TransactionDto} from "../api/ledger/DTOs/TransactionDto";
import EmptyConfig from "../components/EmptyConfig";
import {getComponents, getPhysicalAllocations} from "../api/configuration/Client";
import {ComponentConfigDto, OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import LedgerForm from "../components/LedgerForm";
import type {ColumnGroupType, ColumnType} from "antd/es/table";

const { Text } = Typography;

const renderComponent = (
    entry: LedgerEntryDto | undefined,
    components: ComponentConfigDto[],
    physicalAllocations: OrderableEntityDto[]
) => {
    if (entry === undefined ) {
        return (<></>);
    }
    
    let physicalAllocationText = entry.physicalAllocationId !== undefined
        ? (
            <Text style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                {physicalAllocations.find(allocation => allocation.key === entry.physicalAllocationId)?.name ?? entry.physicalAllocationId}
            </Text>
        )
        : (<></>);
    
    return (
        <Space direction={"vertical"}>
            <Text>
                {components.find(component => component.key === entry.componentId)?.name ?? entry.componentId}
            </Text>
            {physicalAllocationText}
        </Space>
    );
}

const buildEntryColumnGroup = (
    name: string,
    selector: (transaction: TransactionDto) => LedgerEntryDto | undefined,
    components: ComponentConfigDto[],
    physicalAllocations: OrderableEntityDto[]
): ColumnGroupType<TransactionDto> => {
    return (
        {
            title: name,
            children: [
                {
                    key: `${name}-component`,
                    title: 'Component',
                    render: transaction => renderComponent(selector(transaction), components, physicalAllocations)
                },
                {
                    key: `${name}-value`,
                    title: 'Value',
                    render: transaction => (
                        <Money value={selector(transaction)?.value} colorCoding={true} isInferred={false}/>
                    )
                }
            ]
        }
    );
};

const buildColumns = (
    components: ComponentConfigDto[],
    physicalAllocations: OrderableEntityDto[],
    onEdit: (transaction: TransactionDto) => void
): (ColumnType<TransactionDto> | ColumnGroupType<TransactionDto>)[] => [
    {
        key: 'date',
        title: 'Date',
        render: transaction => transaction.date.format('YYYY-MM-DD')
    },
    buildEntryColumnGroup(
        'Debit', 
        transaction => transaction.debit,
        components,
        physicalAllocations
    ),
    {
        key: 'divider',
        title: '',
        render: _ => <ArrowRightOutlined />
    },
    buildEntryColumnGroup(
        'Credit',
        transaction => transaction.credit,
        components,
        physicalAllocations
    ),
    {
        key: 'delete',
        title: '',
        fixed: 'right',
        render: transaction => (
            <Space direction='horizontal'>
                <EditOutlined onClick={() => onEdit(transaction)} />
                <Popconfirm
                    title='Sure to delete?'
                    okText={'Yes'}
                    cancelText={'No'}
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => await deleteTransaction(transaction.key)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            </Space>
        )
    }
];

const LedgerPage: React.FC = () => {
    const [data, setData] = React.useState<TransactionDto[]>([]);
    const [components, setComponents] = React.useState<ComponentConfigDto[]>([]);
    const [physicalAllocations, setPhysicalAllocations] = React.useState<OrderableEntityDto[]>([]);
    
    const [formOpen, setFormOpen] = React.useState(false);
    const [initialValue, setInitialValue] = React.useState<TransactionDto>();
    
    const populateData = async () => {
        const dataResponse = getTransactions();
        setData(dataResponse);
        
        const componentsResponse = await getComponents();
        setComponents(componentsResponse);

        const physicalAllocationsResponse = await getPhysicalAllocations();
        setPhysicalAllocations(physicalAllocationsResponse);
    }

    useEffect(() => {
        populateData();
        // eslint-disable-next-line
    }, []);
    
    return (
        <EmptyConfig enabled={data.length === 0}>
            <>
                <LedgerForm 
                    open={formOpen} 
                    initialValue={initialValue}
                    onSubmit={async transaction => {
                        await upsertTransaction(transaction);
                        setFormOpen(false);
                    }} 
                    onCancel={() => setFormOpen(false)} 
                    componentOptions={components.map(c => ({value: c.key, label: c.name}))}
                    allocationOptions={physicalAllocations.map(p => ({value: p.key, label: p.name}))}
                />
                <Table
                    bordered
                    dataSource={data}
                    columns={buildColumns(components, physicalAllocations, transaction => {
                        setInitialValue(transaction);
                        setFormOpen(true);
                    })}
                    pagination={false}
                    rowKey='key'
                    scroll={{ x: 'max-content' }}
                />
                <FloatButton icon={<PlusOutlined/>} onClick={() => {
                    setInitialValue(undefined);
                    setFormOpen(true);
                }} />
            </>
        </EmptyConfig>
    );
}

export default LedgerPage;