import React, {FC, useEffect, useState} from "react";
import {Button, Space, Card, Row, Col, Divider, Switch} from "antd";
import {CheckOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {
    ComponentConfigDto,
    GroupConfigDto,
    GroupTypeConfigDto,
    OrderableEntityDto
} from "../api/configuration/DTOs/ConfigurationDto";
import {
    deleteComponent,
    deleteGroup, deleteGroupType,
    deletePhysicalAllocation,
    getConfiguration,
    upsertComponent,
    upsertGroup,
    upsertGroupType,
    upsertPhysicalAllocation
} from "../api/configuration/Client";
import {EditableRowsTable} from "../components/table/EditableRowsTable";
import SimpleDropdown from "../components/SimpleDropdown";
import DeleteModal from "../components/DeleteModal";
import IconPicker from "../components/IconPicker";
import DynamicIcon from "../components/DynamicIcon";
import {GroupDto} from "../api/configuration/DTOs/GroupDto";

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

const ConfigurationPage: React.FC = () => {
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
    
    let addNewPhysicalAllocationDto = () => {
        let newItem = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (physicalAllocations.at(-1)?.displaySequence ?? 0) + 1,
        } as OrderableEntityDto;
        
        setPhysicalAllocations([...physicalAllocations, newItem]);
    }

    let addNewGroupTypeDto = async () => {
        let newItem = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (groupTypes.at(-1)?.displaySequence ?? 0) + 1,
            icon: 'EllipsisOutlined'
        } as GroupTypeConfigDto;
        
        await upsertGroupType(newItem);
        await populateData();
    }

    let addNewGroupDto = async () => {
        let newItem = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (groupTypes.at(-1)?.displaySequence ?? 0) + 1,
            groupTypeId: groupTypes[0].key
        };
        
        await upsertGroup(newItem);
        await populateData();
    }
    
    let addNewComponent = async (group: GroupConfigDto) => {
        let newComponent = {
            key: crypto.randomUUID(),
            name: "New Item",
            displaySequence: (group.components.at(-1)?.displaySequence ?? 0) + 1,
            groupId: group.key,
            defaultPhysicalAllocationId: undefined
        };
        
        await upsertComponent(newComponent);
        await populateData();
    }
    
    let renderEnabledIcon = (enabled: boolean) => enabled
        ? <CheckOutlined/>
        : <CloseOutlined/>;
    
    let buildGroupTypeDeleteModal = (groupType: GroupTypeConfigDto) => (
        <DeleteModal
            title={`Deleting '${groupType.name}'`}
            description={'Deleting Group Type will irreversibly delete all Groups, Components, and value history within it. Are you sure you want to delete this Group Type?'}
            deletedName={groupType.name}
            onConfirm={async () => {
                await deleteGroupType(groupType.key);
                await populateData();
            }}
        />
    )

    let buildGroupDeleteModal = (group: GroupDto) => (
        <DeleteModal
            title={`Deleting '${group.name}'`}
            description={'Deleting Group will irreversibly delete all Components and value history within it. Are you sure you want to delete this Group?'}
            deletedName={group.name}
            onConfirm={async () => {
                await deleteGroup(group.key);
                await populateData();
            }}
        />
    )

    let buildComponentDeleteModal = (component: ComponentConfigDto) => (
        <DeleteModal
            title={`Deleting '${component.name}'`}
            description={'Deleting Component will irreversibly delete all value history within it. Are you sure you want to delete this Component?'}
            deletedName={component.name}
            onConfirm={async () => {
                await deleteComponent(component.key);
                await populateData();
            }}
        />
    )

    let buildPhysicalAllocationDeleteModal = (physicalAllocation: OrderableEntityDto) => (
        <DeleteModal
            title={`Deleting '${physicalAllocation.name}'`}
            description={'Deleting Physical Allocation will irreversibly delete all associations with value history within it. Are you sure you want to delete this Physical Allocation?'}
            deletedName={physicalAllocation.name}
            onConfirm={async () => {
                await deletePhysicalAllocation(physicalAllocation.key);
                await populateData();
            }}
        />
    )
    
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
                                    title: 'Icon',
                                    dataIndex: 'icon',
                                    render: (iconName: string) => <DynamicIcon name={iconName} />,
                                    width: '20%',
                                    editable: true,
                                    renderEditor: <IconPicker value="" onChange={() => {}} />
                                },
                                {
                                    title: 'Show score in summary',
                                    dataIndex: 'showScore',
                                    render: renderEnabledIcon,
                                    width: '20%',
                                    editable: true,
                                    renderEditor: <Switch />
                                }
                            ]}
                            onRowSave={async groupType => {
                                await upsertGroupType(groupType);
                                await populateData();
                            }}
                            renderDeleteButton={buildGroupTypeDeleteModal}
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
                                    width: '40%',
                                    editable: true,
                                },
                                {
                                    title: 'Group Type',
                                    dataIndex: 'groupTypeId',
                                    render: (groupTypeId: string) => groupTypes.find(x => x.key === groupTypeId)!.name,
                                    width: '20%',
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
                                    width: '20%',
                                    editable: true,
                                },
                                {
                                    title: 'Show targets',
                                    dataIndex: 'showTargets',
                                    render: renderEnabledIcon,
                                    width: '20%',
                                    editable: true,
                                    renderEditor: <Switch />
                                }
                            ]}
                            onRowSave={async group => {
                                console.log('Upsert', group)
                                await upsertGroup(group);
                                await populateData();
                            }}
                            renderDeleteButton={buildGroupDeleteModal}
                        />
                    </TableCard>
                </Col>

            </Row>
            
            <Divider/>

            {groups.map(group => (
                <TableCard title={group.name} onAdd={() => addNewComponent(group)}>
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
                            await upsertComponent(component);
                            await populateData();
                        }}
                        renderDeleteButton={buildComponentDeleteModal}
                    />
                </TableCard>
            ))}
            <TableCard title={'Physical Allocations'} onAdd={addNewPhysicalAllocationDto}>
                <EditableRowsTable
                    data={physicalAllocations}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            width: '80%',
                            editable: true,
                        },
                        {
                            title: 'Sequence',
                            dataIndex: 'displaySequence',
                            width: '20%',
                            editable: true,
                        }
                    ]}
                    onRowSave={async physicalAllocation => {
                        await upsertPhysicalAllocation(physicalAllocation);
                        await populateData();
                    }}
                    renderDeleteButton={buildPhysicalAllocationDeleteModal}
                />
            </TableCard>
        </Space>
    );
};

export default ConfigurationPage;
