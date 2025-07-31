import React, { useState } from 'react';
import EditableTable, {EditableColumn} from './EditableTable';

interface MyRow {
    key: string;
    name: string;
    amount: number;
}

const initialData: MyRow[] = [
    { key: '1', name: 'Item A', amount: 100 },
    { key: '2', name: 'Item B', amount: 200 },
];

const PortfolioSummary = () => {
    const [data, setData] = useState(initialData);

    const handleSave = async (key: string, updated: Partial<MyRow>) => {
        const newData = [...data];
        const index = newData.findIndex(item => item.key === key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...updated });
            setData(newData);
        }
    };

    const handleDelete = async (key: string) => {
        setData(data.filter(item => item.key !== key));
    };

    const handleAdd = () => {
        const newKey = (Math.random() * 10000).toFixed(0);
        setData(prev => [...prev, { key: newKey, name: '', amount: 0 }]);
    };

    const columns : EditableColumn<MyRow>[] = [
        { title: 'Name', dataIndex: 'name', editable: true },
        { title: 'Amount', dataIndex: 'amount', editable: true },
    ];

    return (
        <EditableTable
            data={data}
            columns={columns}
            onSave={handleSave}
            onDelete={handleDelete}
            onAdd={handleAdd}
        />
    );
};

export default PortfolioSummary;
