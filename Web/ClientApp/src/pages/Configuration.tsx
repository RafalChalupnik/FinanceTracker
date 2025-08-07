import React, {useEffect, useState} from "react";
import {Input, Button, Space, Card, Popconfirm, Typography, InputNumber} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {DataIndexPath, EditableColumn, EditableTable} from "../components/EditableTable";
import {
    Config, upsertWallet, deleteAsset, deleteDebt, deleteWallet, deleteWalletComponent, getConfiguration,
    OrderableEntity,
    upsertAsset, upsertDebt,
    upsertWalletComponent,
    WalletEntity
} from "../api/ConfigurationApi";

const {Text} = Typography;

interface EntityTableProps {
    title: string | React.ReactNode;
    data: OrderableEntity[];
    onUpdate: (entity: OrderableEntity) => void | Promise<void>;
    onDelete: (entityId: string) => void | Promise<void>;
}

const EntityTable: React.FC<EntityTableProps> = (props) => {
    let [newEntry, setNewEntry] = useState<OrderableEntity | undefined>(undefined);
    
    const updateEntity = async (record: OrderableEntity, path: DataIndexPath<OrderableEntity>, value: any) => {
        setValue(record, path, value);
        await props.onUpdate(record)
        setNewEntry(undefined);
    };

    const columns: EditableColumn<OrderableEntity>[] = [
        {
            title: "Name",
            key: 'name',
            dataIndex: "name",
            editable: {
                onUpdate: updateEntity
            }
        },
        {
            title: "Sequence",
            key: 'displaySequence',
            dataIndex: "displaySequence",
            editable: {
                onUpdate: updateEntity
            }
        }
    ];

    const buildData = () => {
        return newEntry !== undefined
            ? [...props.data, newEntry]
            : props.data
    }

    const handleAdd = () => {
        const newItem: OrderableEntity = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: props.data.length + 1,
        };
        setNewEntry(newItem);
    };

    function setValue(obj: any, path: string | (string | number)[], value: any): void {
        const keys = Array.isArray(path) ? path : [path];

        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
    }

    return (
        <Card title={props.title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} >Add new entry</Button>}>
            <EditableTable 
                records={buildData()} 
                columns={columns}
                onDelete={async record => props.onDelete(record.key)}
            />
        </Card>
    );
};

interface WalletProps {
    wallet: WalletEntity;
    onUpdateWallet: (wallet: OrderableEntity) => Promise<void>;
    onDeleteWallet: (walletId: string) => Promise<void>;
    onUpdateComponent: (walletId: string, entity: OrderableEntity) => Promise<void>;
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
    const [config, setConfig] = useState<Config>({
        assets: [],
        debts: [],
        wallets: [],
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
        </Space>
    );
};

export default Configuration;
