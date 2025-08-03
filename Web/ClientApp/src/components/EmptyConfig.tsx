import {Empty, Space, Typography} from "antd";
import React from "react";

const { Text } = Typography;

interface EmptyConfigProps {
    enabled: boolean;
    children: React.ReactNode;
}

const EmptyConfig: React.FC<EmptyConfigProps> = (props) => {
    if (props.enabled) {
        return (
            <Space direction={"vertical"} style={{ width: '100%', height: '100%', flex: 1 }} align={'center'}>
                <Empty/>
                <Text>There is nothing to do here - make sure you configured the app correctly.</Text>
            </Space>
        );
    }
    
    return (
        <>
            {props.children}
        </>
    );
}

export default EmptyConfig;