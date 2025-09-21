import React, {FC, useEffect, useState} from "react";
import {Input, Button, Space, Card, Popconfirm, Typography, InputNumber, Row, Col, Divider, FormRule} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined, WalletOutlined} from "@ant-design/icons";
import {Column, ExtendableTable} from "../components/table/ExtendableTable";
import {buildDeleteColumn} from "../components/table/ColumnBuilder";
import {
    ComponentConfigDto,
    GroupConfigDto,
    GroupTypeConfigDto,
    OrderableEntityDto
} from "../api/configuration/DTOs/ConfigurationDto";
import {
    deleteComponent,
    deleteGroup,
    deleteGroupType, deletePhysicalAllocation,
    getConfiguration, upsertComponent,
    upsertGroup,
    upsertGroupType, upsertPhysicalAllocation
} from "../api/configuration/Client";
import {buildPhysicalAllocationColumn} from "../components/table/ConfigurationColumnBuilder";
import {GroupDto, GroupTypeDto} from "../api/configuration/DTOs/GroupDto";
import IconPicker from "../components/IconPicker";
import {EditableRowsTable} from "../components/table/EditableRowsTable";
import DynamicIcon from "../components/DynamicIcon";
import SimpleDropdown from "../components/SimpleDropdown";

const {Text} = Typography;

interface TableCardProps {
    title: string,
    onAdd: () => void,
    children: React.ReactNode
}

const TableCard: FC<TableCardProps> = (props) => {
    return (
        <Card style={{ height: "100%" }} title={props.title} extra={<Button icon={<PlusOutlined />} onClick={props.onAdd}/>}>
            {props.children}
        </Card>
    );
}

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

// interface WalletProps {
//     wallet: WalletDataDto;
//     physicalAllocations: OrderableEntityDto[];
//     onUpdateWallet: (wallet: OrderableEntityDto) => Promise<void>;
//     onDeleteWallet: (walletId: string) => Promise<void>;
//     onUpdateComponent: (walletId: string, entity: WalletComponentDataDto) => Promise<void>;
//     onDeleteComponent: (componentId: string) => Promise<void>;
// }
//
// const Wallet: React.FC<WalletProps> = (props) => {
//     let [name, setName] = useState(props.wallet.name);
//     let [sequence, setSequence] = useState(props.wallet.displaySequence);
//    
//     let physicalAllocationColumn = buildPhysicalAllocationColumn(
//         props.physicalAllocations,
//         async component => props.onUpdateComponent(props.wallet.key, component)
//     );
//    
//     return (
//         <>
//             <EntityTable
//                 title={
//                     <Space direction='horizontal'>
//                         <Text>Name:</Text>
//                         <Input value={name} onChange={e => setName(e.target.value)}/>
//
//                         <Text>Sequence:</Text>
//                         <InputNumber value={sequence} onChange={e => setSequence(e?.valueOf() ?? 0)}/>
//
//                         <Button
//                             icon={<SaveOutlined />}
//                             onClick={async () => props.onUpdateWallet({
//                                 key: props.wallet.key,
//                                 name: name,
//                                 displaySequence: sequence
//                             })}
//                         />
//
//                         <Popconfirm
//                             title='Sure to delete?'
//                             okText={'Yes'}
//                             cancelText={'No'}
//                             okButtonProps={{ danger: true }}
//                             onConfirm={async () => await props.onDeleteWallet(props.wallet.key)}
//                         >
//                             <Button icon={<DeleteOutlined />}/>
//                         </Popconfirm>
//                     </Space>
//                 }
//                 data={props.wallet.components}
//                 createNewRow={sequence => ({
//                     key: crypto.randomUUID(),
//                     name: "New Component",
//                     displaySequence: sequence,
//                     defaultPhysicalAllocationId: undefined
//                 })}
//                 onUpdate={async component => props.onUpdateComponent(props.wallet.key, component)}
//                 onDelete={props.onDeleteComponent}
//                 extraColumns={[physicalAllocationColumn]}
//             />
//         </>
//     );
// };

const Configuration: React.FC = () => {
    const [groupTypes, setGroupTypes] = useState<GroupTypeConfigDto[]>([]);
    const [groups, setGroups] = useState<GroupConfigDto[]>([]);
    const [physicalAllocations, setPhysicalAllocations] = useState<OrderableEntityDto[]>([]);
    
    const populateData = async () => {
        let config = await getConfiguration();
        
        setGroupTypes(config.groupTypes);
        setGroups(config.groupTypes.flatMap(x => x.groups));
        setPhysicalAllocations(config.physicalAllocations);
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

    let addNewGroupTypeDto = () => {
        let newItem = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (groupTypes.at(-1)?.displaySequence ?? 0) + 1,
            icon: 'EllipsisOutlined'
        } as GroupTypeConfigDto;
        
        setGroupTypes([...groupTypes, newItem]);
    }

    let addNewGroupDto = () => {
        let newItem = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (groupTypes.at(-1)?.displaySequence ?? 0) + 1,
            groupTypeId: groupTypes[0].key
        } as GroupConfigDto;

        setGroups([...groups, newItem]);
    }
    
    let addNewComponent = (group: GroupConfigDto) => {
        let newComponent = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (group.components.at(-1)?.displaySequence ?? 0) + 1,
            groupId: group.key,
            defaultPhysicalAllocationId: undefined
        }
        
        updateGroupComponents(group, [...group.components, newComponent]);
    }
    
    let updateGroupComponents = (group: GroupConfigDto, components: ComponentConfigDto[]) => {
        group.components = components
            .sort((a, b) => a.displaySequence - b.displaySequence);

        const newGroups = [
            ...groups.filter(x => x.key !== group.key),
            group,
        ];

        setGroups(newGroups.sort((a, b) => {
            let aGroupType = groupTypes.find(x => x.key == a.groupTypeId)!;
            let bGroupType = groupTypes.find(x => x.key == b.groupTypeId)!;

            if (aGroupType.displaySequence !== bGroupType.displaySequence) {
                return aGroupType.displaySequence - bGroupType.displaySequence;
            }

            return a.displaySequence - b.displaySequence;
        }));
    }
    
    return (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Row gutter={16} style={{ alignItems: "stretch" }}>
                <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
                    <TableCard title={'Group Types'} onAdd={addNewGroupTypeDto}>
                        <EditableRowsTable
                            data={groupTypes}
                            columns={[
                                {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    // inputType: 'text',
                                    width: '50%',
                                    editable: true,
                                },
                                {
                                    title: 'Sequence',
                                    dataIndex: 'displaySequence',
                                    width: '25%',
                                    editable: true,
                                },
                                {
                                    title: 'Icon',
                                    dataIndex: 'icon',
                                    render: (iconName: string) => <DynamicIcon name={iconName} />,
                                    width: '25%',
                                    editable: true,
                                    renderEditor: <IconPicker value="" onChange={() => {}} />
                                }
                            ]}
                            onRowSave={async groupType => {
                                await upsertGroupType(groupType)

                                const newGroupTypes = [
                                    ...groupTypes.filter(x => x.key !== groupType.key),
                                    groupType,
                                ];

                                setGroupTypes(newGroupTypes.sort((a, b) => a.displaySequence - b.displaySequence));
                            }}
                            onRowDelete={async groupType => {
                                await deleteGroupType(groupType.key);
                                setGroupTypes(groupTypes.filter(x => x.key !== groupType.key));
                            }}
                        />
                    </TableCard>
                </Col>

                <Col span={12}>
                    <TableCard title={'Groups'} onAdd={addNewGroupDto}>
                        <EditableRowsTable
                            data={groups}
                            columns={[
                                {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    width: '50%',
                                    editable: true,
                                },
                                {
                                    title: 'Group Type',
                                    dataIndex: 'groupTypeId',
                                    render: (groupTypeId: string) => groupTypes.find(x => x.key === groupTypeId)!.name,
                                    width: '25%',
                                    editable: true,
                                    renderEditor: (
                                        <SimpleDropdown
                                            availableValues={groupTypes}
                                            value=''
                                            isRequired={true}
                                            onChange={() => {}}
                                        />
                                    )
                                },
                                {
                                    title: 'Sequence',
                                    dataIndex: 'displaySequence',
                                    width: '25%',
                                    editable: true,
                                }
                            ]}
                            onRowSave={async group => {
                                await upsertGroup(group)

                                const newGroups = [
                                    ...groups.filter(x => x.key !== group.key),
                                    group,
                                ];

                                setGroups(newGroups.sort((a, b) => {
                                    let aGroupType = groupTypes.find(x => x.key == a.groupTypeId)!;
                                    let bGroupType = groupTypes.find(x => x.key == b.groupTypeId)!;
                                    
                                    if (aGroupType.displaySequence !== bGroupType.displaySequence) {
                                        return aGroupType.displaySequence - bGroupType.displaySequence;
                                    }
                                    
                                    return a.displaySequence - b.displaySequence;
                                }));
                            }}
                            onRowDelete={async group => {
                                await deleteGroup(group.key);
                                setGroups(groups.filter(x => x.key !== group.key));
                            }}
                        />
                    </TableCard>
                </Col>

            </Row>
            
            <Divider/>

            {groups.map(group => (
                <TableCard title={group.name} onAdd={() => {addNewComponent(group)}}>
                    <EditableRowsTable
                        data={group.components}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                width: '40%',
                                editable: true,
                            },
                            {
                                title: 'Sequence',
                                dataIndex: 'displaySequence',
                                width: '20%',
                                editable: true,
                            },
                            {
                                title: 'Group',
                                dataIndex: 'groupId',
                                render: (groupId: string) => groups.find(x => x.key === groupId)!.name,
                                width: '20%',
                                editable: true,
                                renderEditor: (
                                    <SimpleDropdown
                                        availableValues={groups}
                                        value=''
                                        isRequired={true}
                                        onChange={() => {}}
                                    />
                                )
                            },
                            {
                                title: 'Default Physical Allocation',
                                dataIndex: 'defaultPhysicalAllocationId',
                                editorRules: [
                                    {
                                        required: false,
                                        message: ''
                                    }
                                ],
                                render: (physicalAllocationId: string) => physicalAllocations.find(x => x.key === physicalAllocationId)?.name ?? '-',
                                width: '20%',
                                editable: true,
                                renderEditor: (
                                    <SimpleDropdown
                                        availableValues={physicalAllocations}
                                        value=''
                                        isRequired={false}
                                        onChange={() => {}}
                                    />
                                )
                            }
                        ]}
                        onRowSave={async component => {
                            console.log('Upsert', component);
                            await upsertComponent(component);

                            const newComponents = [
                                ...group.components.filter(x => x.key !== group.key),
                                component,
                            ];

                            updateGroupComponents(group, newComponents
                                .sort((a, b) => a.displaySequence - b.displaySequence));
                        }}
                        onRowDelete={async component => {
                            await deleteComponent(component.key);
                            updateGroupComponents(group, group.components.filter(x => x.key !== group.key));
                        }}
                    />
                </TableCard>
            ))}
            
            {/*<EntityTable*/}
            {/*    title="Assets"*/}
            {/*    data={config.assets}*/}
            {/*    createNewRow={createEmptyOrderableEntityDto}*/}
            {/*    onUpdate={async asset => {*/}
            {/*        await upsertAsset(asset);*/}
            {/*        await populateData();*/}
            {/*    }}*/}
            {/*    onDelete={async assetId => {*/}
            {/*        await deleteAsset(assetId);*/}
            {/*        await populateData();*/}
            {/*    }}*/}
            {/*/>*/}
            
            {/*<EntityTable*/}
            {/*    title="Debts"*/}
            {/*    data={config.debts}*/}
            {/*    createNewRow={createEmptyOrderableEntityDto}*/}
            {/*    onUpdate={async debt => {*/}
            {/*        await upsertDebt(debt);*/}
            {/*        await populateData();*/}
            {/*    }}*/}
            {/*    onDelete={async debtId => {*/}
            {/*        await deleteDebt(debtId);*/}
            {/*        await populateData();*/}
            {/*    }}*/}
            {/*/>*/}
            
            {/*<Card*/}
            {/*    title="Wallets"*/}
            {/*    extra={*/}
            {/*        <Button*/}
            {/*            icon={<PlusOutlined />}*/}
            {/*            onClick={async () => {*/}
            {/*                await upsertWallet({*/}
            {/*                        key: crypto.randomUUID(),*/}
            {/*                        name: "New Wallet",*/}
            {/*                        displaySequence: config.wallets.length + 1*/}
            {/*                    }*/}
            {/*                )*/}
            {/*                await populateData();*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Add Wallet*/}
            {/*        </Button>*/}
            {/*    }*/}
            {/*>*/}
            {/*    {config.wallets.map(wallet => (*/}
            {/*        <Wallet*/}
            {/*            wallet={wallet}*/}
            {/*            physicalAllocations={config.physicalAllocations}*/}
            {/*            onUpdateWallet={async wallet => {*/}
            {/*                await upsertWallet(wallet);*/}
            {/*                await populateData();*/}
            {/*            }}*/}
            {/*            onDeleteWallet={async walletId => {*/}
            {/*                await deleteWallet(walletId);*/}
            {/*                await populateData();*/}
            {/*            }}*/}
            {/*            onUpdateComponent={async (walletId, component) => {*/}
            {/*                await upsertWalletComponent(walletId, component);*/}
            {/*                await populateData();*/}
            {/*            }}*/}
            {/*            onDeleteComponent={async componentId => {*/}
            {/*                await deleteWalletComponent(componentId);*/}
            {/*                await populateData();*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</Card>*/}
            
            <EntityTable
                title="Physical Allocations"
                data={physicalAllocations}
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
