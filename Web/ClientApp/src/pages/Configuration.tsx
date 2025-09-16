import React, {useEffect, useState} from "react";
import {Input, Button, Space, Card, Popconfirm, Typography, InputNumber, Row, Col} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {Column, ExtendableTable} from "../components/table/ExtendableTable";
import {buildDeleteColumn} from "../components/table/ColumnBuilder";
import {
    ConfigurationDto,
    OrderableEntityDto,
    WalletComponentDataDto,
    WalletDataDto
} from "../api/configuration/DTOs/ConfigurationDto";
import {
    deleteAsset,
    deleteDebt, deletePhysicalAllocation, deleteWallet, deleteWalletComponent,
    getConfiguration,
    upsertAsset,
    upsertDebt, upsertPhysicalAllocation,
    upsertWallet, upsertWalletComponent
} from "../api/configuration/Client";
import {buildGroupTypeColumn, buildPhysicalAllocationColumn} from "../components/table/ConfigurationColumnBuilder";
import {deleteGroupType, getGroupTypes, upsertGroupType} from "../api/configuration/GroupTypesClient";
import {deleteGroup, getGroups, upsertGroup} from "../api/configuration/GroupsClient";
import {GroupDto} from "../api/configuration/DTOs/GroupDto";

const {Text} = Typography;

interface EntityTableProps<T extends OrderableEntityDto> {
    title: string | React.ReactNode;
    data: T[];
    createNewRow: (sequence: number) => T;
    onUpdate: (entity: T) => void | Promise<void>;
    onDelete: (entityId: string) => void | Promise<void>;
    extraColumns?: Column<T>[];
}

function EntityTable<T extends OrderableEntityDto>(props: EntityTableProps<T>) {
    let [newEntry, setNewEntry] = useState<T | undefined>(undefined);
    
    const updateEntity = async (record: T) => {
        setNewEntry(undefined);
        await props.onUpdate(record)
    };
    
    let columns : Column<T>[] = [
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
        ...props.extraColumns ?? [],
        buildDeleteColumn(async row => await props.onDelete(row.key))
    ]

    const buildData = () => {
        return newEntry !== undefined
            ? [...props.data, newEntry]
            : props.data
    }

    const handleAdd = () => {
        let newItem = props.createNewRow(props.data.length + 1);
        setNewEntry(newItem);
    };

    return (
        <Card style={{ height: "100%" }} title={props.title} extra={<Button icon={<PlusOutlined />} onClick={handleAdd} >Add new entry</Button>}>
            <ExtendableTable 
                rows={buildData()} 
                columns={columns}
            />
        </Card>
    );
};

interface WalletProps {
    wallet: WalletDataDto;
    physicalAllocations: OrderableEntityDto[];
    onUpdateWallet: (wallet: OrderableEntityDto) => Promise<void>;
    onDeleteWallet: (walletId: string) => Promise<void>;
    onUpdateComponent: (walletId: string, entity: WalletComponentDataDto) => Promise<void>;
    onDeleteComponent: (componentId: string) => Promise<void>;
}

const Wallet: React.FC<WalletProps> = (props) => {
    let [name, setName] = useState(props.wallet.name);
    let [sequence, setSequence] = useState(props.wallet.displaySequence);
    
    let physicalAllocationColumn = buildPhysicalAllocationColumn(
        props.physicalAllocations,
        async component => props.onUpdateComponent(props.wallet.key, component)
    );
    
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
                createNewRow={sequence => ({
                    key: crypto.randomUUID(),
                    name: "New Component",
                    displaySequence: sequence,
                    defaultPhysicalAllocationId: undefined
                })}
                onUpdate={async component => props.onUpdateComponent(props.wallet.key, component)}
                onDelete={props.onDeleteComponent}
                extraColumns={[physicalAllocationColumn]}
            />
        </>
    );
};

const Configuration: React.FC = () => {
    const [groupTypes, setGroupTypes] = useState<OrderableEntityDto[]>([]);
    const [groups, setGroups] = useState<GroupDto[]>([]);
    
    const [config, setConfig] = useState<ConfigurationDto>({
        assets: [],
        debts: [],
        wallets: [],
        physicalAllocations: []
    });
    
    const populateData = async () => {
        const config = await getConfiguration();
        const groupTypes = await getGroupTypes();
        const groups = await getGroups();
        setConfig(config)
        setGroupTypes(groupTypes);
        setGroups(groups);
    }

    useEffect(() => {
        populateData()
    }, [])
    
    let createEmptyOrderableEntityDto = (sequence: number): OrderableEntityDto => {
        return {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: sequence,
        };
    }
    
    let createEmptyGroupDto = (sequence: number): GroupDto => {
        return {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: sequence,
            groupTypeId: groupTypes[0].key
        };
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Row gutter={16} style={{ alignItems: "stretch" }}>
                <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
                    <EntityTable
                        title="Group Types"
                        data={groupTypes}
                        createNewRow={createEmptyOrderableEntityDto}
                        onUpdate={async groupType => {
                            await upsertGroupType(groupType);
                            setGroupTypes([...groupTypes, groupType]);
                        }}
                        onDelete={async groupTypeId => {
                            await deleteGroupType(groupTypeId)
                            setGroupTypes(groupTypes.filter(groupType => groupType.key !== groupTypeId));
                        }}
                    />
                </Col>

                <Col span={12}>
                    <EntityTable
                        title="Groups"
                        data={groups}
                        createNewRow={createEmptyGroupDto}
                        onUpdate={async group => {
                            await upsertGroup(group);
                            setGroups([...groups, group]);
                        }}
                        onDelete={async groupId => {
                            await deleteGroup(groupId)
                            setGroups(groups.filter(group => group.key !== groupId));
                        }}
                        extraColumns={[buildGroupTypeColumn(groupTypes, async group => await upsertGroup(group))]}
                    />
                </Col>

            </Row>
            
            <EntityTable
                title="Assets"
                data={config.assets}
                createNewRow={createEmptyOrderableEntityDto}
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
                createNewRow={createEmptyOrderableEntityDto}
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
                        physicalAllocations={config.physicalAllocations}
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
                createNewRow={createEmptyOrderableEntityDto}
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
