import React, {FC, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Divider, Modal, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import { DateGranularity } from "../api/value-history/DTOs/DateGranularity";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import DateGranularityPicker from "../components/DateGranularityPicker";
import MoneyCharts from "../components/charts/custom/MoneyCharts";
import CompositionChart from "../components/charts/custom/CompositionChart";
import EmptyConfig from "../components/EmptyConfig";
import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import {getPhysicalAllocations} from "../api/configuration/Client";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import TargetChart from "../components/charts/custom/TargetChart";
import ScoreChart from "../components/charts/custom/ScoreChart";
import EditableMoneyTable from "../components/money/EditableMoneyTable";

interface MoneyPageProps {
    title: string;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityTableDto>;
    showInferredValues: boolean;
    showCompositionChart: boolean;
    editable?: EditableProps;
    setInflation?: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>;
    allowedGranularities?: DateGranularity[];
    defaultGranularity?: DateGranularity;
}

interface EditableProps {
    onUpdate: (id: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>;
    onDelete?: (date: Dayjs) => Promise<void>;
    setTarget?: (date: Dayjs, value: number) => Promise<void>
} 

const MoneyPage: FC<MoneyPageProps> = (props: MoneyPageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);
    const [newEntryDate, setNewEntryDate] = useState<Dayjs | undefined>(undefined);
    const [granularity, setGranularity] = useState<DateGranularity>(props.defaultGranularity ?? DateGranularity.Day);
    const [fromDate, setFromDate] = useState<Dayjs | undefined>(undefined);
    const [toDate, setToDate] = useState<Dayjs | undefined>(undefined);

    const [data, setData] = useState<EntityTableDto>({
        columns: [] as EntityColumnDto[],
        rows: [] as ValueHistoryRecordDto[]
    });

    const [physicalAllocations, setPhysicalAllocations] = useState<OrderableEntityDto[]>([]);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const dataResponse = await props.getData(
            granularity,
            from,
            to
        );
        
        const physicalAllocationsResponse = await getPhysicalAllocations();

        setData({
            columns: dataResponse.columns,
            rows: dataResponse.rows
        });
        
        setPhysicalAllocations(physicalAllocationsResponse);
    }

    useEffect(() => {
        populateData();
    }, []);

    let onUpdateCallback = async () => {
        setNewEntryDate(undefined);
        await populateData(granularity, fromDate, toDate);
    }
    
    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }

        setNewEntryDate(dayjs(selectedDate))
        setIsModalOpen(false);
    };

    const buildData = () => {
        if (newEntryDate === undefined) {
            return data.rows;
        }
        
        let newRow = {
            key: newEntryDate.format("YYYY-MM-DD"),
            entities: data.columns.map(_ => undefined),
            summary: undefined,
            target: undefined,
            score: undefined,
            newEntry: true
        }
        
        let newData = [
            ...data.rows,
            newRow
        ]

        return newData.sort((a, b) => dayjs(a.key).unix() - dayjs(b.key).unix());
    }
    
    let onComponentUpdate = props.editable?.onUpdate
        ? async (id: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => {
            await props.editable!.onUpdate(id, date, value, physicalAllocationId);
            await onUpdateCallback();
        }
        : undefined;
    
    let onComponentDelete = props.editable?.onDelete
        ? async (date: Dayjs) => {
            await props.editable!.onDelete!(date);
            await onUpdateCallback();
        }
        : undefined;
    
    let onTargetUpdate = props.editable?.setTarget
        ? async (date: Dayjs, value: number) => {
            await props.editable!.setTarget!(date, value);
            await onUpdateCallback();
        }
        : undefined;
    
    let onInflationUpdate = props.setInflation
        ? async (year: number, month: number, value: number, confirmed: boolean) => {
            await props.setInflation!(year, month, value, confirmed);
            await onUpdateCallback();
        }
        : undefined;
    
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
                    <EditableMoneyTable 
                        columns={data.columns}
                        rows={buildData()}
                        granularity={granularity} 
                        showInferredValues={props.showInferredValues} 
                        physicalAllocations={physicalAllocations}
                        onComponentUpdate={onComponentUpdate}
                        onComponentDelete={onComponentDelete}
                        onTargetUpdate={onTargetUpdate}
                        onInflationUpdate={onInflationUpdate}
                    />
                    <Divider/>
                    <MoneyCharts 
                        headers={data.columns}
                        data={data.rows}
                    />
                    {props.showCompositionChart && (<CompositionChart
                        headers={data.columns}
                        records={data.rows}
                    />)}
                    {props.editable?.setTarget && (
                        <TargetChart data={data.rows}/>
                    )}
                    {props.setInflation && (
                        <ScoreChart data={data.rows}/>
                    )}
                </Card>
                <Modal
                    title="Pick a date"
                    open={isModalOpen}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalOpen(false)}
                >
                    <DatePicker onChange={setSelectedDate} />
                </Modal>
            </div>
        </EmptyConfig>
    );
}

export default MoneyPage;