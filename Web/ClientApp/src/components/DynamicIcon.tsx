import type {IconBaseProps} from "@ant-design/icons/lib/components/Icon";
import React from "react";
import * as Icons from "@ant-design/icons";
import {FileUnknownOutlined} from "@ant-design/icons";

type IconName = keyof typeof Icons;

interface DynamicIconProps extends IconBaseProps {
    name: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = (props) => {
    const IconComponent = Icons[props.name as IconName] as React.FC<IconBaseProps>;

    return IconComponent
        ? (<IconComponent {...props} />)
        : (<FileUnknownOutlined />);
};

export default DynamicIcon;