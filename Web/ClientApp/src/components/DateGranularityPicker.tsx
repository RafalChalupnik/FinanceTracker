import React, {useState} from 'react';
import {DatePicker, Select, Space} from 'antd';
import {PickerMode} from "rc-picker/lib/interface";
import dayjs, {Dayjs, OpUnitType, QUnitType} from "dayjs";

import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";

dayjs.extend(quarterOfYear);

const { Option } = Select;

interface DateRangePickerWithTypeProps {
    minDate: Dayjs | undefined;
    maxDate: Dayjs | undefined;
    onChange: (type: DateGranularity, start: Dayjs, end: Dayjs) => Promise<void>;
    allowedOptions?: DateGranularity[];
}

const DateRangePickerWithType: React.FC<DateRangePickerWithTypeProps> = (props) => {
    const allOptions: { value: DateGranularity; picker: PickerMode; label: string }[] = [
        { value: DateGranularity.Day, picker: 'date', label: "Date" },
        { value: DateGranularity.Week, picker: 'week', label: "Week" },
        { value: DateGranularity.Month, picker: 'month', label: "Month" },
        { value: DateGranularity.Quarter, picker: 'quarter', label: "Quarter" },
        { value: DateGranularity.Year, picker: 'year', label: "Year" },
    ];
    
    const [minDate, setMinDate] = useState<Dayjs | undefined>(undefined);
    const [maxDate, setMaxDate] = useState<Dayjs | undefined>(undefined);
    const [mode, setMode] = useState<PickerMode>(props.allowedOptions
        ? allOptions.filter(opt => props.allowedOptions!.includes(opt.value))[0].picker
        : allOptions[0].picker
    );
    
    if (minDate === undefined) {
        setMinDate(props.minDate);
    }

    if (maxDate === undefined) {
        setMaxDate(props.maxDate);
    }
    
    const mapToDateGranularity = (mode: PickerMode): DateGranularity => {
        return allOptions.find(option => option.picker === mode)!.value;
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
        
        await props.onChange(mapToDateGranularity(mode), startDate, endDate);
    }

    const optionsToRender = props.allowedOptions
        ? allOptions.filter(opt => props.allowedOptions!.includes(opt.value))
        : allOptions;

    return (
        <Space direction='horizontal'>
            <Select aria-label="Picker Type" value={mode} onChange={setMode} style={{width: 100}}>
                {optionsToRender.map(({ picker, label }) => (
                    <Option value={picker}>
                        {label}
                    </Option>
                ))}
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