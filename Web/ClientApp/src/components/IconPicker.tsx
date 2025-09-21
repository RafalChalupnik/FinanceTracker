import React, { useState, useMemo } from 'react';
import {Input, Popover, List, Tooltip, Button, Space} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import * as AntdIcons from '@ant-design/icons';

const AllIcons: { [key: string]: React.ComponentType<any> } = {};
const iconExclusions = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor'];

Object.keys(AntdIcons)
    .filter(key =>
        !iconExclusions.includes(key) &&
        key.charAt(0) === key.charAt(0).toUpperCase() // Keep only component names (PascalCase)
    )
    .forEach(key => {
        AllIcons[key] = (AntdIcons as any)[key];
    });

const iconNames = Object.keys(AllIcons);

export interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);

    const filteredIcons = useMemo(
        () =>
            iconNames.filter(name =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    );

    const handleIconSelect = (iconName: string) => {
        props.onChange(iconName);
        setPopoverVisible(false);
    };

    const SelectedIcon = AllIcons[props.value];

    const popoverContent = (
        <Space direction='vertical' style={{ width: 300 }}>
            <Input.Search
                placeholder="Search for an icon"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 12 }}
                allowClear
            />
            <List
                grid={{ gutter: 8, column: 4 }}
                dataSource={filteredIcons}
                style={{maxHeight: 250, overflowY: 'auto'}}
                renderItem={iconName => {
                    const IconComponent = AllIcons[iconName];
                    return (
                        <List.Item>
                            <Tooltip title={iconName}>
                                <div
                                    onClick={() => handleIconSelect(iconName)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.3s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <IconComponent style={{ fontSize: '24px' }} />
                                </div>
                            </Tooltip>
                        </List.Item>
                    );
                }}
            />
        </Space>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
        >
            <Button icon={SelectedIcon ? <SelectedIcon/> : <DownOutlined />} onClick={() => setPopoverVisible(true)} />
        </Popover>
    );
};

export default IconPicker;