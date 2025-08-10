import React, {FC, ReactNode} from "react";

interface ColoredPercentProps {
    value: number | undefined | null,
    colorCoding: boolean,
    extra?: ReactNode,
}

const ColoredPercent: FC<ColoredPercentProps> = ({value, colorCoding, extra}) => {
    if (value === undefined || value === null) {
        return (
            <div style={{ textAlign: 'right' }}>
                -
            </div>
        );
    }

    const color = colorCoding && value !== 0
        ? (value > 0 ? 'green' : 'red')
        : 'black'
    
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ flexGrow: 1, textAlign: 'inherit' }}>
                {extra}
            </div>
            <div style={{ color, textAlign: 'right' }}>
                {`${value.toFixed(2)}%`}
            </div>
        </div>
    );
}

export default ColoredPercent;