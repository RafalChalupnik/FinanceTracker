import React, {FC, ReactNode, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Divider, Modal, Popconfirm, Space, Tooltip, Typography} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import { DateGranularity } from "../../api/value-history/DTOs/DateGranularity";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../../api/value-history/DTOs/EntityTableDto";
import {Column, ColumnGroup, CustomEditableColumn, ExtendableTable} from "../table/ExtendableTable";
import DateGranularityPicker from "../DateGranularityPicker";
import MoneyCharts from "../charts/custom/MoneyCharts";
import CompositionChart from "../charts/custom/CompositionChart";
import EmptyConfig from "../EmptyConfig";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import {getPhysicalAllocations} from "../../api/configuration/Client";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import TargetChart from "../charts/custom/TargetChart";
import ScoreChart from "../charts/custom/ScoreChart";
import MoneyForm from "./MoneyForm";
import {EntityValueSnapshotDto, ValueSnapshotDto} from "../../api/value-history/DTOs/ValueSnapshotDto";
import Money from "./Money";
import TargetForm from "./TargetForm";
import ColoredPercent from "../ColoredPercent";
import InflationForm from "./InflationForm";
import EditableMoneyTable from "./EditableMoneyTable";

const {Text} = Typography;

interface EditableMoneyComponentProps {
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

const EditableMoneyComponent: FC<EditableMoneyComponentProps> = (props: EditableMoneyComponentProps) => {
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
                        onComponentUpdate={props.editable?.onUpdate}
                        onComponentDelete={props.editable?.onDelete}
                        onTargetUpdate={props.editable?.setTarget}
                        onInflationUpdate={props.setInflation}
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
                    <TargetChart data={data.rows}/>
                    <ScoreChart data={data.rows}/>
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

export default EditableMoneyComponent;