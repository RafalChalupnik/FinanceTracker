import React, { useState, useMemo } from 'react';
import { Input, Popover, List, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import * as AntdIcons from '@ant-design/icons';

// --- Helper Functions and Data ---

// Create a dictionary of all Ant Design icons, excluding non-icon exports.
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

// --- Component Props Interface ---

export interface IconPickerProps {
    /** The name of the currently selected icon */
    value?: string;
    /** Callback function that is triggered when an icon is selected */
    onChange?: (iconName: string) => void;
    /** Placeholder for the input */
    placeholder?: string;
}

// --- The IconPicker Component ---

/**
 * A user-friendly component to browse and select an icon from the Ant Design library.
 */
export const IconPicker: React.FC<IconPickerProps> = ({
                                                          value,
                                                          onChange,
                                                          placeholder = 'Select an icon',
                                                      }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);

    // Memoize the filtered list of icons to prevent re-calculation on every render
    const filteredIcons = useMemo(
        () =>
            iconNames.filter(name =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    );

    // Handler for when an icon is clicked in the popover list
    const handleIconSelect = (iconName: string) => {
        onChange?.(iconName);
        setPopoverVisible(false);
    };

    // Get the React component for the currently selected icon
    const SelectedIcon = value ? AllIcons[value] : null;

    /**
     * The content of the popover, including a search input and the grid of icons.
     */
    const popoverContent = (
        <div style={{ width: 300 }}>
            <Input.Search
                placeholder="Search for an icon"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 12 }}
                allowClear
            />
            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                <List
                    grid={{ gutter: 8, column: 4 }}
                    dataSource={filteredIcons}
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
            </div>
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
        >
            <Input
                value={value}
                placeholder={placeholder}
                readOnly
                style={{ cursor: 'pointer' }}
                addonBefore={SelectedIcon ? <SelectedIcon style={{ color: '#096dd9' }}/> : <DownOutlined />}
                addonAfter={<DownOutlined />}
            />
        </Popover>
    );
};

export default IconPicker;