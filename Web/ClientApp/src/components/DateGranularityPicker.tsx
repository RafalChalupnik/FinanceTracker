import React, { useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
import {PickerMode} from "rc-picker/lib/interface";
import dayjs, {Dayjs, OpUnitType, QUnitType} from "dayjs";
import {DateGranularity} from "../api/ValueHistoryApi";

import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear);

const { Option } = Select;

interface DateRangePickerWithTypeProps {
    minDate: Dayjs | undefined;
    maxDate: Dayjs | undefined;
    onChange: (type: DateGranularity, start: Dayjs, end: Dayjs) => Promise<void>;
}

const DateRangePickerWithType: React.FC<DateRangePickerWithTypeProps> = (props) => {
    const [minDate, setMinDate] = useState<Dayjs | undefined>(undefined);
    const [maxDate, setMaxDate] = useState<Dayjs | undefined>(undefined);
    const [mode, setMode] = useState<PickerMode>('date');
    
    if (minDate === undefined) {
        setMinDate(props.minDate);
    }

    if (maxDate === undefined) {
        setMaxDate(props.maxDate);
    }
    
    const mapToDateGranularity = (mode: PickerMode): DateGranularity => {
        switch (mode) {
            case 'date':
                return DateGranularity.Day;
            case 'week':
                return DateGranularity.Week;
            case 'month':
                return DateGranularity.Month;
            case 'quarter':
                return DateGranularity.Quarter;
            case 'year':
                return DateGranularity.Year;
            default:
                throw new Error(`Unknown mode: ${mode}`);
        }
    }

    const mapToOpUnitType = (mode: PickerMode): OpUnitType | QUnitType => {
        switch (mode) {
            case 'date':
                return 'day';
            case 'week':
                return 'week';
            case 'month':
                return 'month';
            case 'quarter':
                return 'quarter';
            case 'year':
                return 'year';
            default:
                throw new Error(`Unknown mode: ${mode}`);
        }
    }

    const onChange = async (start: Dayjs, end: Dayjs) => {
        const unitType = mapToOpUnitType(mode)

        const startDate = start.startOf(unitType);
        const endDate = end.endOf(unitType);
        
        console.log('Start:', startDate)
        console.log('End:', endDate)

        await props.onChange(mapToDateGranularity(mode), startDate, endDate);
    };

    return (
        <Space direction='horizontal'>
            <Select aria-label="Picker Type" value={mode} onChange={setMode} style={{width: 100}}>
                <Option value="date">Date</Option>
                <Option value="month">Month</Option>
                <Option value="quarter">Quarter</Option>
                <Option value="year">Year</Option>
            </Select>
            <DatePicker.RangePicker 
                minDate={minDate}
                maxDate={maxDate}
                picker={mode}
                onChange={async (dates, dateStrings) => {
                    await onChange(dates![0]!, dates![1]!);
                }} 
            />
        </Space>
    );
};

export default DateRangePickerWithType;