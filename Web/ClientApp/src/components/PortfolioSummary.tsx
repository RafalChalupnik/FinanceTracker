import React, { useState } from "react";
import {EditableTable, EditableColumn, DataIndexPath} from "./EditableTable";

interface Person {
    key: string;
    name: string;
    details: {
        age: number;
        address: string;
    };
}

const initialData: Person[] = [
    { key: "1", name: "Alice", details: { age: 30, address: "New York" } },
    { key: "2", name: "Bob", details: { age: 25, address: "London" } },
];

const columns: EditableColumn<Person>[] = [
    { title: "Name", dataIndex: "name", editable: true },
    {
        title: "Details",
        children: [
            { title: "Age", dataIndex: ["details", "age"], editable: true },
            { title: "Address", dataIndex: ["details", "address"], editable: true },
        ],
    },
];
const PortfolioSummary = () => {
    const [data, setData] = useState<Person[]>(initialData);

    return (
        <EditableTable
            records={data}
            columns={columns}
            onUpdate={(record, path, value) => {
                const updated = setValue(record, normalizePath(path), value);
                setData((prev) =>
                    prev.map((r) => (r.key === record.key ? updated : r))
                );
            }}
            onDelete={(record) =>
                setData((prev) => prev.filter((r) => r.key !== record.key))
            }
        />
    );
};

const normalizePath = (path: DataIndexPath<Person>): (string | number)[] =>
    Array.isArray(path) ? path : [path as string];

function getValue(obj: any, path: (string | number)[]): any {
    return path.reduce((acc, key) => (acc !== undefined ? acc[key] : undefined), obj);
}

function setValue(obj: any, path: (string | number)[], value: any): any {
    const newObj = { ...obj };
    let current = newObj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    current[path[path.length - 1]] = value;
    return newObj;
}

export default PortfolioSummary;
