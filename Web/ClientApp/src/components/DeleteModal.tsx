import {FC, useState} from "react";
import {Button, Input, Modal, Space, Typography} from "antd";

const {Text} = Typography;

interface DeleteModalProps {
    open: boolean,
    title: string,
    description: string,
    deletedName: string,
    onConfirm: () => void | Promise<void>,
    onCancel: () => void
}

const DeleteModal: FC<DeleteModalProps> = (props) => {
    const [currentInputValue, setCurrentInputValue] = useState('');

    const isMatch = currentInputValue.trim() === props.deletedName;
    
    return (
        <Modal
            title={props.title}
            open={props.open}
            onCancel={props.onCancel}
            footer={[
                <Button 
                    key="cancel" 
                    onClick={props.onCancel}
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
    );
}

export default DeleteModal;