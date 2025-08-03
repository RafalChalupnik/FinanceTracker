import React, {useEffect, useState} from "react";
import { Input, Button, Space, Card } from "antd";
import {DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {ConfigurationDto, getConfig} from "../ApiClient";
import {EditableColumn, EditableTable} from "../components/EditableTable";

interface EntityTableProps {
    title: string | React.ReactNode;
    data: OrderableEntity[];
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

    return (
        <Card title={props.title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} />}>
            <EditableTable 
                records={buildData()} 
                columns={columns} 
                onUpdate={(record, path, value) => {
                    alert(`Updated ${record.name} at path ${path} to ${value}!`);}
                }
                onDelete={record => alert(`Deleted ${record.name}!`)}
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
                />
            ))}
        </>
    );
};

const ConfigurationManager: React.FC = () => {
    const [config, setConfig] = useState<Configuration>({
        assets: [],
        debts: [],
        wallets: [],
    });

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
            />

            <EntityTable
                title="Debts"
                data={config.debts}
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

export default ConfigurationManager;
