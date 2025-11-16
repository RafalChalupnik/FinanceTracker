import React, {useEffect} from 'react';
import {FloatButton, List, Popconfirm, Space, Typography} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {ArrowRightOutlined, DeleteOutlined} from "@ant-design/icons";
import Money from "../components/money/Money";
import {Column, ColumnGroup, ExtendableTable} from "../components/table/ExtendableTable";
import MoneyForm from "../components/money/MoneyForm";
import {
    deleteTransaction,
    getTransactions,
    updateTransactionCreditAmount,
    updateTransactionDebitAmount
} from "../api/ledger/Client";
import {LedgerEntry, Transaction} from "../api/ledger/DTOs/Transaction";
import EmptyConfig from "../components/EmptyConfig";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getComponents, getPhysicalAllocations} from "../api/configuration/Client";
import {ComponentConfigDto, OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";

const { Text } = Typography;

const renderComponent = (
    entry: LedgerEntry | undefined,
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
    selector: (transaction: Transaction) => LedgerEntry | undefined,
    components: ComponentConfigDto[],
    physicalAllocations: OrderableEntityDto[],
    onSave: (transaction: Transaction, value: MoneyDto) => void | Promise<void>
): ColumnGroup<Transaction> => {
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
                    ),
                    editable: {
                        renderEditable: (transaction, closeCallback) => (
                            <MoneyForm
                                initialValue={selector(transaction)?.value}
                                onSave={function (value: MoneyDto, physicalAllocationId?: string): (void | Promise<void>) {
                                    onSave(transaction, value);
                                    closeCallback();
                                }}
                                onCancel={function (): void {
                                    closeCallback();
                                }}/>
                        )
                    }
                }
            ]
        }
    );
};

const buildColumns = (
    components: ComponentConfigDto[],
    physicalAllocations: OrderableEntityDto[]
): (Column<Transaction> | ColumnGroup<Transaction>)[] => [
    {
        key: 'date',
        title: 'Date',
        render: transaction => transaction.date.format('YYYY-MM-DD')
    },
    buildEntryColumnGroup(
        'Debit', 
        transaction => transaction.debit,
        components,
        physicalAllocations,
        (transaction, value) => updateTransactionDebitAmount(transaction.key, value)
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
        physicalAllocations,
        (transaction, value) => updateTransactionCreditAmount(transaction.key, value)
    ),
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
                onConfirm={async () => await deleteTransaction(transaction.key)} // TODO: Update state
            >
                <DeleteOutlined />
            </Popconfirm>
        )
    }
];

const LedgerPage: React.FC = () => {
    const [data, setData] = React.useState<Transaction[]>([]);
    const [components, setComponents] = React.useState<ComponentConfigDto[]>([]);
    const [physicalAllocations, setPhysicalAllocations] = React.useState<OrderableEntityDto[]>([]);
    
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
                <ExtendableTable rows={data} columns={buildColumns(components, physicalAllocations)}/>
                <FloatButton onClick={() => console.log('onClick')} />
            </>
        </EmptyConfig>
    );
}

export default LedgerPage;