import React, {FC, useState} from "react";
import {Button, Input, Modal, Space, Typography} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const {Text} = Typography;

interface DeleteModalProps {
    title: string,
    description: string,
    deletedName: string,
    onConfirm: () => void | Promise<void>
}

const DeleteModal: FC<DeleteModalProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentInputValue, setCurrentInputValue] = useState('');

    const isMatch = currentInputValue.trim() === props.deletedName;
    
    return (
        <>
            <DeleteOutlined onClick={() => setIsOpen(true)} />
            <Modal
                title={props.title}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        disabled={!isMatch}
                        onClick={props.onConfirm}
                    >
                        Delete
                    </Button>
                ]}
            >
                <Space direction='vertical'>
                    <Text>{props.description}</Text>
                    <Text>
                        To confirm deletion, please type:&nbsp;
                        <Text strong className="ml-1">{props.deletedName}</Text>
                    </Text>
                </Space>
                <Input
                    className="mt-3"
                    placeholder={`Type '${props.deletedName}'`}
                    value={currentInputValue}
                    onChange={(e) => setCurrentInputValue(e.target.value)}
                />
            </Modal>
        </>
    );
}

export default DeleteModal;