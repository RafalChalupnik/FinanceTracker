import React, { useState } from "react";
import {Modal, Form, DatePicker, Select, InputNumber, Button, Space, Row, Col, Typography} from "antd";
import { Transaction } from "../api/ledger/DTOs/Transaction";
import dayjs from "dayjs";

const { Title } = Typography;

// Component props
interface LedgerFormProps {
    open: boolean;
    onSubmit: (t: Transaction) => void;
    onCancel: () => void;
    componentOptions: { label: string; value: string }[];
    allocationOptions: { label: string; value: string }[];
    currencyOptions: { label: string; value: string }[];
}

const LedgerForm : React.FC<LedgerFormProps> = (props) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const transaction: Transaction = {
                    key: crypto.randomUUID(),
                    date: values.date,
                    debit: values.debit,
                    credit: values.credit,
                };
                props.onSubmit(transaction);
                form.resetFields();
            })
            .catch(() => {});
    };

    const ledgerEntryFields = (prefix: string) => (
        <>
            <Form.Item
                name={[prefix, "componentId"]}
                label="Component"
                rules={[{ required: true }]}
            >
                <Select options={props.componentOptions} />
            </Form.Item>

            <Form.Item
                name={[prefix, "physicalAllocationId"]}
                label="Allocation"
                rules={[{ required: true }]}
            >
                <Select options={props.allocationOptions} />
            </Form.Item>

            <Form.Item
                name={[prefix, "value", "amount"]}
                label="Amount"
                rules={[{ required: true }]}
            >
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
                name={[prefix, "value", "currency"]}
                label="Currency"
                rules={[{ required: true }]}
            >
                <Select options={props.currencyOptions} />
            </Form.Item>
        </>
    );

    return (
        <Modal
            title="Add Ledger Transaction"
            open={props.open}
            onCancel={props.onCancel}
            onOk={handleOk}
            okText="Save"
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item name="date" label="Date" initialValue={dayjs()} rules={[{ required: true, message: "Pick a date" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Title level={5}>Debit</Title>
                        {ledgerEntryFields("debit")}
                    </Col>

                    <Col xs={24} md={12}>
                        <Title level={5}>Credit</Title>
                        {ledgerEntryFields("credit")}
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default LedgerForm;