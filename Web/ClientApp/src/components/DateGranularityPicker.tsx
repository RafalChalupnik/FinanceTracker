import React, {useState} from 'react';
import {DatePicker, Select, Space} from 'antd';
import {PickerMode} from "rc-picker/lib/interface";
import dayjs, {Dayjs, OpUnitType, QUnitType} from "dayjs";

import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {DateRange} from "../types/Range";

dayjs.extend(quarterOfYear);

const { Option } = Select;

interface DateRangePickerWithTypeProps {
    onChange: (type: DateGranularity, start?: Dayjs, end?: Dayjs) => Promise<void>;
    allowedDateRange?: DateRange;
    allowedModes?: DateGranularity[];
    defaultMode?: DateGranularity;
}

const DateRangePickerWithType: React.FC<DateRangePickerWithTypeProps> = (props) => {
    const allOptions: { value: DateGranularity; picker: PickerMode; label: string }[] = [
        { value: DateGranularity.Day, picker: 'date', label: "Date" },
        { value: DateGranularity.Week, picker: 'week', label: "Week" },
        { value: DateGranularity.Month, picker: 'month', label: "Month" },
        { value: DateGranularity.Quarter, picker: 'quarter', label: "Quarter" },
        { value: DateGranularity.Year, picker: 'year', label: "Year" },
    ];
    
    const getInitialMode = () => {
        if (props.defaultMode) {
            return allOptions.find(option => option.value === props.defaultMode)!.picker;
        }
        
        if (props.allowedModes) {
            return allOptions.find(opt => props.allowedModes!.includes(opt.value))!.picker;
        }
        
        return allOptions[0].picker;
    }

    const [allowedDateRange, setAllowedDateRange] = useState<DateRange | undefined>(props.allowedDateRange);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(props.allowedDateRange);
    const [mode, setMode] = useState<PickerMode>(getInitialMode);
    
    // This state is required, so the whole date range is persisted even on data reload
    if (allowedDateRange === undefined) {
        setAllowedDateRange(props.allowedDateRange);
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
    
    const onModeChange = async (mode: PickerMode) => {
        setMode(mode);
        await props.onChange(mapToDateGranularity(mode), selectedDateRange?.start, selectedDateRange?.end);
    }

    const onDatesChange = async (start: Dayjs, end: Dayjs) => {
        const unitType = mapToOpUnitType(mode)
        
        let newRange = {
            start: start.startOf(unitType),
            end: end.endOf(unitType)
        };

        setSelectedDateRange(newRange)

        await props.onChange(mapToDateGranularity(mode), newRange?.start, newRange?.end);
    }

    const optionsToRender = props.allowedModes
        ? allOptions.filter(opt => props.allowedModes!.includes(opt.value))
        : allOptions;

    return (
        <Space direction='horizontal'>
            <Select 
                aria-label="Picker Type" 
                value={mode} 
                onChange={onModeChange} 
                style={{width: 100}}
            >
                {optionsToRender.map(({ picker, label }) => (
                    <Option value={picker}>
                        {label}
                    </Option>
                ))}
            </Select>
            <DatePicker.RangePicker 
                allowClear={false}
                minDate={allowedDateRange?.start}
                maxDate={allowedDateRange?.end}
                defaultValue={[allowedDateRange?.start, allowedDateRange?.end]}
                picker={mode}
                onChange={async (dates) => {
                    await onDatesChange(dates![0]!, dates![1]!);
                }} 
            />
        </Space>
    );
};

export default DateRangePickerWithType;