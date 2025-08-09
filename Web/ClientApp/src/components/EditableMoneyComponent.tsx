import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Modal, Space, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import DateGranularityPicker from "./DateGranularityPicker";
import MoneyChart from "./MoneyChart";
import {Column, ColumnGroup, ExtendableTable} from "./ExtendableTable";
import {buildComponentsColumns, buildDateColumn, buildSummaryColumn} from "./ColumnBuilder";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {MoneyDto} from "../api/value-history/DTOs/Money";

const { Title } = Typography;

interface EditableMoneyComponentProps<T> {
    title: string;
    rows: T[]
    columns: EntityColumnDto[],
    refreshData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<void>;
    extraColumns?: (Column<T> | ColumnGroup<T>)[];
    editable?: EditableProps<T>;
    extra?: React.ReactNode;
    allowedDatePickerOptions?: DateGranularity[];
}

interface EditableProps<T> {
    createEmptyRow: (date: Dayjs, columns: EntityColumnDto[]) => T;
    onUpdate: (id: string, date: string, value: MoneyDto) => Promise<void>;
    onDelete: (date: string) => Promise<void>;
} 

export function EditableMoneyComponent<T extends ValueHistoryRecordDto>(props: EditableMoneyComponentProps<T>) {
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
            props.editable!.createEmptyRow(newEntryDate, props.columns)
        ]

        return newData.sort((a, b) => dayjs(a.key).unix() - dayjs(b.key).unix());
    }
    
    return (
        <div style={{ maxWidth: '95vw' }}>
            <Card 
                title={props.title} 
                extra={ 
                    <Space direction='horizontal'>
                        <DateGranularityPicker 
                            minDate={props.rows.length > 0 ? dayjs(props.rows[0].key) : undefined}
                            maxDate={props.rows.length > 0 ? dayjs(props.rows[props.rows.length - 1].key) : undefined}
                            onChange={props.refreshData}
                            allowedOptions={props.allowedDatePickerOptions}
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
                    {props.extra}
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