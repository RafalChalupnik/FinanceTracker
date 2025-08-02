import React, {useEffect, useState} from "react";
import { Table, Input, Button, Space, Typography, Popconfirm, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {ConfigurationDto, getConfig, OrderableEntityDto, WalletDataDto} from "../ApiClient";



const EditableCell: React.FC<any> = ({
                                         editing,
                                         dataIndex,
                                         title,
                                         inputType,
                                         record,
                                         index,
                                         children,
                                         ...restProps
                                     }) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Input
                    defaultValue={record[dataIndex]}
                    onChange={(e) => (record[dataIndex] = e.target.value)}
                />
            ) : (
                children
            )}
        </td>
    );
};

const EntityTable: React.FC<{
    title: string;
    data: OrderableEntityDto[];
    setData: (data: OrderableEntityDto[]) => void;
}> = ({ title, data, setData }) => {
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const isEditing = (record: OrderableEntityDto) => record.id === editingKey;

    const edit = (record: Partial<OrderableEntityDto>) => {
        setEditingKey(record.id || "");
    };

    const save = (id: string) => {
        setEditingKey(null);
    };

    const cancel = () => setEditingKey(null);

    const remove = (id: string) => setData(data.filter((d) => d.id !== id));

    const columns: ColumnsType<OrderableEntityDto> = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Sequence",
            dataIndex: "displaySequence",
        },
        {
            title: "Actions",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button onClick={() => save(record.id)} type="link">
                            Save
                        </Button>
                        <Button onClick={cancel} type="link">
                            Cancel
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button onClick={() => edit(record)} type="link">
                            Edit
                        </Button>
                        <Popconfirm title="Sure?" onConfirm={() => remove(record.id)}>
                            <Button type="link">Delete</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        return col
    });

    const handleAdd = () => {
        const newItem: OrderableEntityDto = {
            id: crypto.randomUUID(),
            name: "New Item",
            displaySequence: data.length + 1,
        };
        setData([...data, newItem]);
    };

    return (
        <Card title={title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} />}>
            <Table
                dataSource={data}
                columns={mergedColumns as ColumnsType<any>}
                rowKey="id"
                pagination={false}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
            />
        </Card>
    );
};

const WalletTable: React.FC<{
    wallets: WalletDataDto[];
    setWallets: (data: WalletDataDto[]) => void;
}> = ({ wallets, setWallets }) => {
    return (
        <>
            {wallets.map((wallet, idx) => (
                <Card
                    key={wallet.id}
                    title={
                        <Input
                            value={wallet.name}
                            onChange={(e) => {
                                const newWallets = [...wallets];
                                newWallets[idx].name = e.target.value;
                                setWallets(newWallets);
                            }}
                        />
                    }
                    style={{ marginBottom: 16 }}
                >
                    <EntityTable
                        title="Components"
                        data={wallet.components}
                        setData={(components) => {
                            const newWallets = [...wallets];
                            newWallets[idx].components = components;
                            setWallets(newWallets);
                        }}
                    />
                </Card>
            ))}
        </>
    );
};

const ConfigurationManager: React.FC = () => {
    const [config, setConfig] = useState<ConfigurationDto>({
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
    })

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Typography.Title level={2}>Configuration Manager</Typography.Title>

            <EntityTable
                title="Assets"
                data={config.assets}
                setData={(assets) => setConfig({ ...config, assets })}
            />

            <EntityTable
                title="Debts"
                data={config.debts}
                setData={(debts) => setConfig({ ...config, debts })}
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
                                        id: crypto.randomUUID(),
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
