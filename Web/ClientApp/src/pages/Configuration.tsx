import React, {useEffect, useState} from "react";
import {Input, Button, Space, Card, Popconfirm, Typography, InputNumber} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {EditableColumn, EditableTable} from "../components/EditableTable";
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
    
    const columns: EditableColumn<OrderableEntity>[] = [
        {
            title: "Name",
            key: 'name',
            dataIndex: "name",
            editable: true
        },
        {
            title: "Sequence",
            key: 'displaySequence',
            dataIndex: "displaySequence",
            editable: true
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
        <Card title={props.title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} />}>
            <EditableTable 
                records={buildData()} 
                columns={columns} 
                onUpdate={async (record, path, value) => {
                    setValue(record, path, value);
                    await props.onUpdate(record)
                    setNewEntry(undefined);
                }}
                onDelete={async record => props.onDelete(record.key)}
            />
        </Card>
    );
};

interface WalletTableProps {
    wallets: WalletEntity[];
    onDeleteWallet: (walletId: string) => Promise<void>;
    onUpdateComponent: (walletId: string, entity: OrderableEntity) => Promise<void>;
    onDeleteComponent: (componentId: string) => Promise<void>;
}

const WalletTable: React.FC<WalletTableProps> = (props) => {
    return (
        <>
            {props.wallets.map(wallet => (
                <EntityTable
                    title={
                        <Space direction='horizontal'>
                            <Text>Name:</Text>
                            <Input value={wallet.name}/>

                            <Text>Sequence:</Text>
                            <Input value={wallet.displaySequence}/>
                            
                            <Popconfirm
                                title='Sure to delete?'
                                okText={'Yes'}
                                cancelText={'No'}
                                okButtonProps={{ danger: true }}
                                onConfirm={async () => await props.onDeleteWallet(wallet.key)}
                            >
                                <Button icon={<DeleteOutlined />}/>
                            </Popconfirm>
                        </Space>
                    }
                    data={wallet.components}
                    onUpdate={async component => props.onUpdateComponent(wallet.key, component)}
                    onDelete={props.onDeleteComponent}
                />
            ))}
        </>
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
