import React, {FC, ReactNode, useState} from "react";
import {DataIndexPath, EditableColumn, EditableColumnGroup, EditableTable} from "./EditableTable";
import MoneyForm from "./MoneyForm";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Modal, Space, Typography} from "antd";
import Money from "./Money";
import {PlusOutlined} from "@ant-design/icons";
import {ComponentHeader, ComponentValues, DateGranularity, MoneyDto, ValueHistoryRecord} from "../api/ValueHistoryApi";
import DateGranularityPicker from "./DateGranularityPicker";
import MoneyChart from "./MoneyChart";

const { Title } = Typography;

interface MoneyEditableTableProps {
    title: string;
    rows: ValueHistoryRecord[]
    columns: ComponentHeader[],
    refreshData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<void>,
    extraColumns?: (EditableColumn<ValueHistoryRecord> | EditableColumnGroup<ValueHistoryRecord>)[];
    editable?: EditableProps
}

interface EditableProps {
    onUpdate: (id: string, date: string, value: MoneyDto) => Promise<void>
    onDelete: (date: string) => Promise<void>
} 

const EditableMoneyComponent: FC<MoneyEditableTableProps> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEntryDate, setNewEntryDate] = useState<string | undefined>(undefined);

    function renderMoney(value: MoneyDto | undefined, colorCoding: boolean) : ReactNode {
        return (
            <Money
                value={value}
                colorCoding={colorCoding}
            />
        );
    }
    
    function buildComponentColumns (entityId: string, name: string, index: number) : (EditableColumn<ValueHistoryRecord> | EditableColumnGroup<ValueHistoryRecord>) {
        return {
            title: name,
            children: [
                {
                    title: 'Value',
                    key: entityId,
                    dataIndex: ['components', index, 'value'],
                    render: record => renderMoney(record.components[index]?.value, false),
                    editable: {
                        renderEditableCell:(record, initialValue, close) =>
                            <MoneyForm
                                initialValue={initialValue}
                                onSave={async money => {
                                    await props.editable!.onUpdate(entityId, dayjs(record.date).format('YYYY-MM-DD'), money);
                                    setNewEntryDate(undefined);
                                    close();
                                }}
                                onCancel={close}
                            />
                    }
                },
                {
                    title: 'Change',
                    key: entityId,
                    dataIndex: ['components', index, 'change'],
                    render: record => renderMoney(record.components[index]?.change, true),
                },
                {
                    title: 'Cumulative',
                    key: entityId,
                    dataIndex: ['components', index, 'cumulativeChange'],
                    render: record => renderMoney(record.components[index]?.cumulativeChange, true),
                }
            ]
        }
    }
    
    let componentsColumns = props.columns.map((header, index) => {
        return buildComponentColumns(header.id, header.name, index)
    })
    
    let columns : (EditableColumn<ValueHistoryRecord> | EditableColumnGroup<ValueHistoryRecord>)[] = [
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            fixed: 'left',
            render: record => record.key
        },
        ...componentsColumns,
        {
            title: 'Summary',
            children: [
                {
                    title: 'Value',
                    key: 'summary',
                    dataIndex: ['summary', 'value'],
                    fixed: 'right',
                    render: record => renderMoney(record.summary?.value, false)
                },
                {
                    title: 'Change',
                    key: 'summary',
                    dataIndex: ['summary', 'change'],
                    fixed: 'right',
                    render: record => renderMoney(record.summary?.change, true)
                },
                {
                    title: 'Cumulative',
                    key: 'summary',
                    dataIndex: ['summary', 'cumulativeChange'],
                    fixed: 'right',
                    render: record => renderMoney(record.summary?.cumulativeChange, true)
                }
            ]
        },
        ...(props.extraColumns ?? [])
    ];
    
    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }

        let date = dayjs(selectedDate).format('YYYY-MM-DD');
        setNewEntryDate(date)
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const buildData = () => {
        if (newEntryDate === undefined) {
            return props.rows;
        }

        let newData = [
            ...props.rows,
            {
                key: newEntryDate,
                date: newEntryDate,
                components: props.columns.map(_ => undefined),
                summary: undefined,
                target: undefined
            }
        ]

        return newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    return (
        <div style={{ maxWidth: '95vw' }}>
            <Card 
                title={props.title} 
                extra={ 
                    <Space direction='horizontal'>
                        <DateGranularityPicker 
                            minDate={props.rows.length > 0 ? dayjs(props.rows[0].date) : undefined}
                            maxDate={props.rows.length > 0 ? dayjs(props.rows[props.rows.length - 1].date) : undefined}
                            onChange={props.refreshData}
                        />
                        {props.editable && <Button
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add new entry
                        </Button>}
                    </Space>
                }
                style={{
                    width: '100%',
                    overflowX: 'auto',
                }}
            >
                <Space direction='vertical'>
                    <EditableTable<ValueHistoryRecord>
                        records={buildData()}
                        columns={columns}
                        onDelete={props.editable ? (async record => {
                            await props.editable!.onDelete(record.date)
                        }) : undefined}
                    />
                    <Title level={5}>Value</Title>
                    <MoneyChart 
                        headers={props.columns}
                        data={props.rows}
                        dataSelector={component => component.value}
                    />
                    <Title level={5}>Change</Title>
                    <MoneyChart
                        headers={props.columns}
                        data={props.rows}
                        dataSelector={component => component.change}
                    />
                    <Title level={5}>Cumulative change</Title>
                    <MoneyChart
                        headers={props.columns}
                        data={props.rows}
                        dataSelector={component => component.cumulativeChange}
                    />
                </Space>
            </Card>
            <Modal
                title="Pick a date"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <DatePicker onChange={setSelectedDate} />
            </Modal>
        </div>
    );
}

export default EditableMoneyComponent;