import React, { useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
import {PickerMode} from "rc-picker/lib/interface";
import {Dayjs} from "dayjs";

const { Option } = Select;

interface DateRangePickerWithTypeProps {
    minDate: Dayjs;
    maxDate: Dayjs;
    onChange?: (type: PickerMode, start: Dayjs, end: Dayjs) => void;
}

const DateRangePickerWithType: React.FC<DateRangePickerWithTypeProps> = (props) => {
    const [type, setType] = useState<PickerMode>('date');

    return (
        <Space direction='horizontal'>
            <Select aria-label="Picker Type" value={type} onChange={setType}>
                <Option value="date">Date</Option>
                <Option value="month">Month</Option>
                <Option value="quarter">Quarter</Option>
                <Option value="year">Year</Option>
            </Select>
            <DatePicker.RangePicker 
                minDate={props.minDate}
                maxDate={props.maxDate}
                picker={type}
                onChange={(value) => console.log('#Foo', value)} 
            />
        </Space>
    );
};

export default DateRangePickerWithType;