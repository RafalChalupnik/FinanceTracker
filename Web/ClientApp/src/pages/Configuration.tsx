import React, {useEffect, useState} from "react";
import { Input, Button, Space, Card } from "antd";
import {DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {deleteConfigEntity, getConfig, upsertConfigEntity} from "../ApiClient";
import {EditableColumn, EditableTable} from "../components/EditableTable";

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

const WalletTable: React.FC<{
    wallets: WalletEntity[];
    setWallets: (data: WalletEntity[]) => void;
}> = ({ wallets, setWallets }) => {
    return (
        <>
            {wallets.map((wallet, idx) => (
                <EntityTable
                    title={
                        <Space direction='horizontal'>
                            <Input
                                value={wallet.name}
                                onChange={(e) => {
                                    const newWallets = [...wallets];
                                    newWallets[idx].name = e.target.value;
                                    setWallets(newWallets);
                                }}
                            />
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => alert(`Deleted wallet ${wallet.name}!`)}
                            />
                        </Space>
                    }
                    data={wallet.components}
                    onUpdate={record => alert(`Updated ${record.name}`)}
                    onDelete={record => alert(`Deleted ${record}`)}
                />
            ))}
        </>
    );
};

const Configuration: React.FC = () => {
    const [config, setConfig] = useState<Configuration>({
        assets: [],
        debts: [],
        wallets: [],
    });
    
    const updateEntity = async (path: string, entity: OrderableEntity) => {
        await upsertConfigEntity(path, entity);
        await populateData();
    }

    const deleteEntity = async (path: string, entityId: string) => {
        await deleteConfigEntity(path, entityId);
        await populateData();
    }

    const populateData = async () => {
        const config = await getConfig()
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
                onUpdate={async asset => await updateEntity("assets", asset)}
                onDelete={async assetId => await deleteEntity("assets", assetId)}
            />

            <EntityTable
                title="Debts"
                data={config.debts}
                onUpdate={async debt => await updateEntity("debts", debt)}
                onDelete={async debtId => await deleteEntity("debts", debtId)}
            />

            <Card
                title="Wallets"
                extra={
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() =>
                            setConfig({
                                ...config,
                                wallets: [
                                    ...config.wallets,
                                    {
                                        key: crypto.randomUUID(),
                                        name: "New Wallet",
                                        displaySequence: config.wallets.length + 1,
                                        components: [],
                                    },
                                ],
                            })
                        }
                    >
                        Add Wallet
                    </Button>
                }
            >
                <WalletTable
                    wallets={config.wallets}
                    setWallets={(wallets) => setConfig({ ...config, wallets })}
                />
            </Card>
        </Space>
    );
};

export default Configuration;
