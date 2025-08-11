import React, {useEffect, useState} from "react";
import {Input, Button, Space, Card, Popconfirm, Typography, InputNumber} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Column, ExtendableTable} from "../components/table/ExtendableTable";
import {buildDeleteColumn} from "../components/table/ColumnBuilder";
import {ConfigurationDto, OrderableEntityDto, WalletDataDto} from "../api/configuration/DTOs/ConfigurationDto";
import {
    deleteAsset,
    deleteDebt, deletePhysicalAllocation, deleteWallet, deleteWalletComponent,
    getConfiguration,
    upsertAsset,
    upsertDebt, upsertPhysicalAllocation,
    upsertWallet, upsertWalletComponent
} from "../api/configuration/Client";

const {Text} = Typography;

interface EntityTableProps {
    title: string | React.ReactNode;
    data: OrderableEntityDto[];
    onUpdate: (entity: OrderableEntityDto) => void | Promise<void>;
    onDelete: (entityId: string) => void | Promise<void>;
}

const EntityTable: React.FC<EntityTableProps> = (props) => {
    let [newEntry, setNewEntry] = useState<OrderableEntityDto | undefined>(undefined);
    
    const updateEntity = async (record: OrderableEntityDto) => {
        await props.onUpdate(record)
        setNewEntry(undefined);
    };
    
    let columns : Column<OrderableEntityDto>[] = [
        {
            key: 'name',
            title: 'Name',
            render: row => row.name,
            editable: {
                initialValueSelector: (row) => row.name,
                onSave: async (row, value) => {
                    row.name = value;
                    await updateEntity(row)
                }
            }
        },
        {
            key: 'displaySequence',
            title: 'Sequence',
            render: row => row.displaySequence,
            editable: {
                initialValueSelector: (row) => row.displaySequence,
                onSave: async (row, value) => {
                    row.displaySequence = value;
                    await updateEntity(row)
                }
            }
        },
        buildDeleteColumn(async row => await props.onDelete(row.key))
    ]

    const buildData = () => {
        return newEntry !== undefined
            ? [...props.data, newEntry]
            : props.data
    }

    const handleAdd = () => {
        const newItem: OrderableEntityDto = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: props.data.length + 1,
        };
        setNewEntry(newItem);
    };

    return (
        <Card title={props.title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} >Add new entry</Button>}>
            <ExtendableTable 
                rows={buildData()} 
                columns={columns}
            />
        </Card>
    );
};

interface WalletProps {
    wallet: WalletDataDto;
    onUpdateWallet: (wallet: OrderableEntityDto) => Promise<void>;
    onDeleteWallet: (walletId: string) => Promise<void>;
    onUpdateComponent: (walletId: string, entity: OrderableEntityDto) => Promise<void>;
    onDeleteComponent: (componentId: string) => Promise<void>;
}

const Wallet: React.FC<WalletProps> = (props) => {
    let [name, setName] = useState(props.wallet.name);
    let [sequence, setSequence] = useState(props.wallet.displaySequence);
    
    return (
        <>
            <EntityTable
                title={
                    <Space direction='horizontal'>
                        <Text>Name:</Text>
                        <Input value={name} onChange={e => setName(e.target.value)}/>

                        <Text>Sequence:</Text>
                        <InputNumber value={sequence} onChange={e => setSequence(e?.valueOf() ?? 0)}/>

                        <Button
                            icon={<SaveOutlined />}
                            onClick={async () => props.onUpdateWallet({
                                key: props.wallet.key,
                                name: name,
                                displaySequence: sequence
                            })}
                        />

                        <Popconfirm
                            title='Sure to delete?'
                            okText={'Yes'}
                            cancelText={'No'}
                            okButtonProps={{ danger: true }}
                            onConfirm={async () => await props.onDeleteWallet(props.wallet.key)}
                        >
                            <Button icon={<DeleteOutlined />}/>
                        </Popconfirm>
                    </Space>
                }
                data={props.wallet.components}
                onUpdate={async component => props.onUpdateComponent(props.wallet.key, component)}
                onDelete={props.onDeleteComponent}
            />
        </>
    );
};

const Configuration: React.FC = () => {
    const [config, setConfig] = useState<ConfigurationDto>({
        assets: [],
        debts: [],
        wallets: [],
        physicalAllocations: []
    });
    
    const populateData = async () => {
        const config = await getConfiguration()
        setConfig(config)
    }

    useEffect(() => {
        populateData()
    }, [])

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
            <EntityTable
                title="Assets"
                data={config.assets}
                onUpdate={async asset => {
                    await upsertAsset(asset);
                    await populateData();
                }}
                onDelete={async assetId => {
                    await deleteAsset(assetId);
                    await populateData();
                }}
            />

            <EntityTable
                title="Debts"
                data={config.debts}
                onUpdate={async debt => {
                    await upsertDebt(debt);
                    await populateData();
                }}
                onDelete={async debtId => {
                    await deleteDebt(debtId);
                    await populateData();
                }}
            />

            <Card
                title="Wallets"
                extra={
                    <Button
                        icon={<PlusOutlined />}
                        onClick={async () => {
                            await upsertWallet({
                                    key: crypto.randomUUID(),
                                    name: "New Wallet",
                                    displaySequence: config.wallets.length + 1
                                }
                            )
                            await populateData();
                        }}
                    >
                        Add Wallet
                    </Button>
                }
            >
                {config.wallets.map(wallet => (
                    <Wallet
                        wallet={wallet}
                        onUpdateWallet={async wallet => {
                            await upsertWallet(wallet);
                            await populateData();
                        }}
                        onDeleteWallet={async walletId => {
                            await deleteWallet(walletId);
                            await populateData();
                        }}
                        onUpdateComponent={async (walletId, component) => {
                            await upsertWalletComponent(walletId, component);
                            await populateData();
                        }}
                        onDeleteComponent={async componentId => {
                            await deleteWalletComponent(componentId);
                            await populateData();
                        }}
                    />
                ))}
            </Card>
            
            <EntityTable
                title="Physical Allocations"
                data={config.physicalAllocations}
                onUpdate={async physicalAllocation => {
                    await upsertPhysicalAllocation(physicalAllocation);
                    await populateData();
                }}
                onDelete={async physicalAllocationId => {
                    await deletePhysicalAllocation(physicalAllocationId);
                    await populateData();
                }}
            />
        </Space>
    );
};

export default Configuration;
