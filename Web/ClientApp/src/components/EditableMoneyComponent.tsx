import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Modal, Space, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ComponentHeader, DateGranularity, MoneyDto, ValueHistoryRecord} from "../api/ValueHistoryApi";
import DateGranularityPicker from "./DateGranularityPicker";
import MoneyChart from "./MoneyChart";
import {Column, ColumnGroup, ExtendableTable} from "./ExtendableTable";
import {buildComponentsColumns, buildDateColumn, buildSummaryColumn} from "./ColumnBuilder";

const { Title } = Typography;

interface EditableMoneyComponentProps<T> {
    title: string;
    rows: T[]
    columns: ComponentHeader[],
    refreshData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<void>,
    extraColumns?: (Column<T> | ColumnGroup<T>)[];
    editable?: EditableProps
}

interface EditableProps {
    onUpdate: (id: string, date: string, value: MoneyDto) => Promise<void>
    onDelete: (date: string) => Promise<void>
} 

export function EditableMoneyComponent<T extends ValueHistoryRecord>(props: EditableMoneyComponentProps<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);
    const [newEntryDate, setNewEntryDate] = useState<Dayjs | undefined>(undefined);

    let columns = [
        buildDateColumn(),
        ...buildComponentsColumns(props.columns, props.editable?.onUpdate),
        buildSummaryColumn(),
        ...(props.extraColumns ?? [])
    ]
    
    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }

        setNewEntryDate(dayjs(selectedDate))
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
                key: newEntryDate.format("YYYY-MM-DD"),
                date: newEntryDate.format("YYYY-MM-DD"),
                components: props.columns.map(_ => undefined),
                summary: undefined,
                target: undefined
            } as T
        ]

        return newData.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
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
                    <ExtendableTable
                        rows={buildData()} 
                        columns={columns}
                        onDeleteRow={props.editable 
                            ? (async date => {await props.editable!.onDelete(date.toString())}) 
                            : undefined}
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