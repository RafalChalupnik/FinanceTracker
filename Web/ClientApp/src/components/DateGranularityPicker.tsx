import React, { useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
import {PickerMode} from "rc-picker/lib/interface";
import {Dayjs} from "dayjs";
import {DateGranularity} from "../api/ValueHistoryApi";

const { Option } = Select;

interface DateRangePickerWithTypeProps {
    minDate: Dayjs;
    maxDate: Dayjs;
    onChange: (type: DateGranularity, start: Dayjs, end: Dayjs) => Promise<void>;
}

const DateRangePickerWithType: React.FC<DateRangePickerWithTypeProps> = (props) => {
    const [mode, setMode] = useState<PickerMode>('date');
    
    const mapMode = (mode: PickerMode): DateGranularity => {
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

    return (
        <Space direction='horizontal'>
            <Select aria-label="Picker Type" value={mode} onChange={setMode}>
                <Option value="date">Date</Option>
                <Option value="month">Month</Option>
                <Option value="quarter">Quarter</Option>
                <Option value="year">Year</Option>
            </Select>
            <DatePicker.RangePicker 
                minDate={props.minDate}
                maxDate={props.maxDate}
                picker={mode}
                onChange={async (dates, dateStrings) => {
                    await props.onChange(mapMode(mode), dates![0]!, dates![1]!);
                }} 
            />
        </Space>
    );
};

export default DateRangePickerWithType;