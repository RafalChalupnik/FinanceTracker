const ChartColors = [
    '#1890ff',
    '#52c41a',
    '#f5222d',
    '#fa8c16',
    '#722ed1',
    '#13c2c2'
];

export function getChartColor(index: number) {
    return ChartColors[index % ChartColors.length];
}