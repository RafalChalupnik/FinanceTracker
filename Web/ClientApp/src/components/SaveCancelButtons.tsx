import {Button, Space} from "antd";
import React, { FC } from "react";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

interface SaveCancelButtonsProps {
    onSave: () => void | Promise<void>,
    onCancel: () => void | Promise<void>
}

const SaveCancelButtons: FC<SaveCancelButtonsProps> = (props) => {
    return (
        <Space direction='horizontal'>
            <Button
                icon={<SaveOutlined />}
                onClick={props.onSave}
            />
            <Button
                icon={<CloseOutlined />}
                onClick={props.onCancel}
            />
        </Space>
    );
}

export default SaveCancelButtons;