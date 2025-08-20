import React, {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Divider, Modal, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import { DateGranularity } from "../../api/value-history/DTOs/DateGranularity";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../../api/value-history/DTOs/EntityTableDto";
import {Column, ColumnGroup, ExtendableTable} from "../table/ExtendableTable";
import {buildDateColumn, buildDeleteColumn, buildSummaryColumn} from "../table/ColumnBuilder";
import DateGranularityPicker from "../DateGranularityPicker";
import MoneyCharts from "../charts/custom/MoneyCharts";
import CompositionChart from "../charts/custom/CompositionChart";
import EmptyConfig from "../EmptyConfig";

interface EditableMoneyComponentProps<T extends ValueHistoryRecordDto> {
    title: string;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityTableDto<T>>;
    buildComponentColumns: (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>) => ColumnGroup<T>[];
    buildExtraColumns?: (granularity: DateGranularity, refreshCallback: () => Promise<void>) => (Column<T> | ColumnGroup<T>)[];
    editable?: EditableProps<T>;
    extra?: (data: EntityTableDto<T>) => React.ReactNode;
    allowedGranularities?: DateGranularity[];
    defaultGranularity?: DateGranularity;
}

interface EditableProps<T> {
    createEmptyRow: (date: Dayjs, columns: EntityColumnDto[]) => T;
    onDelete?: (date: string) => Promise<void>;
} 

export function EditableMoneyComponent<T extends ValueHistoryRecordDto>(props: EditableMoneyComponentProps<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);
    const [newEntryDate, setNewEntryDate] = useState<Dayjs | undefined>(undefined);
    const [granularity, setGranularity] = useState<DateGranularity>(props.defaultGranularity ?? DateGranularity.Day);
    const [fromDate, setFromDate] = useState<Dayjs | undefined>(undefined);
    const [toDate, setToDate] = useState<Dayjs | undefined>(undefined);

    const [data, setData] = useState<EntityTableDto<T>>({
        columns: [] as EntityColumnDto[],
        rows: [] as T[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await props.getData(
            granularity,
            from,
            to
        );

        setData({
            columns: response.columns,
            rows: response.rows
        });
    }

    useEffect(() => {
        populateData();
    }, []);
    
    let onUpdateCallback = async () => {
        setNewEntryDate(undefined);
        await populateData(granularity, fromDate, toDate);
    }
    
    let columns = [
        buildDateColumn(),
        ...props.buildComponentColumns(data.columns, granularity, onUpdateCallback),
        buildSummaryColumn(),
        ...(props.buildExtraColumns
            ? props.buildExtraColumns!(granularity, onUpdateCallback)
            : []
        )
    ]
    
    if (props.editable?.onDelete !== undefined && granularity === DateGranularity.Day) {
        columns.push(
            buildDeleteColumn(async row => await props.editable!.onDelete!(row.key))  
        );
    }
    
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
            return data.rows;
        }
        
        let newRow = props.editable!.createEmptyRow(newEntryDate, data.columns)

        let newData = [
            ...data.rows,
            newRow
        ]

        return newData.sort((a, b) => dayjs(a.key).unix() - dayjs(b.key).unix());
    }
    
    return (
        <EmptyConfig enabled={data.columns.length === 0}>
            <div style={{ width: '95vw' }}>
                <Card 
                    title={props.title} 
                    extra={ 
                        <Space direction='horizontal'>
                            <DateGranularityPicker 
                                allowedDateRange={data.rows.length === 0 ? undefined : {
                                    start: dayjs(data.rows[0].key),
                                    end: dayjs(data.rows[data.rows.length - 1].key)
                                }}
                                onChange={async (granularity, start, end) => {
                                    setGranularity(granularity)
                                    setFromDate(start);
                                    setToDate(end);
                                    await populateData(granularity, start, end);
                                }}
                                allowedModes={props.allowedGranularities}
                                defaultMode={props.defaultGranularity}
                            />
                            {props.editable && <Button
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Add new entry
                            </Button>}
                        </Space>
                    }
                    style={{ width: '100%' }}
                >
                    <ExtendableTable
                        rows={buildData()} 
                        columns={columns}
                    />
                    <Divider/>
                    <MoneyCharts 
                        headers={data.columns}
                        data={data.rows}
                    />
                    <CompositionChart
                        headers={data.columns}
                        records={data.rows}
                    />
                    {props.extra?.(data)}
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
        </EmptyConfig>
    );
}