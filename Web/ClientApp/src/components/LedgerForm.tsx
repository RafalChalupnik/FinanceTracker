import React from "react";
import {Modal, Form, DatePicker, Select, Row, Col, Typography, Space, Checkbox, Divider} from "antd";
import { Transaction } from "../api/ledger/DTOs/Transaction";
import dayjs from "dayjs";
import InputMoney from "./money/InputMoney";

const { Title } = Typography;

// Component props
interface LedgerFormProps {
    open: boolean;
    onSubmit: (t: Transaction) => void;
    onCancel: () => void;
    componentOptions: { label: string; value: string }[];
    allocationOptions: { label: string; value: string }[];
}

const LedgerForm : React.FC<LedgerFormProps> = (props) => {
    const [form] = Form.useForm();
    const [showDebit, setShowDebit] = React.useState(false);
    const [showCredit, setShowCredit] = React.useState(false);

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
                console.log(transaction);
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
                rules={[{ required: false }]}
            >
                <Select options={props.allocationOptions} />
            </Form.Item>

            <Form.Item
                name={[prefix, "value"]}
                label="Amount"
                rules={[{ required: true }]}
                initialValue={undefined}
            >
                <InputMoney/>
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
                        <Space direction="horizontal" align='center'>
                            <Title level={5} style={{ margin: 0 }}>Debit</Title>
                            <Checkbox value={showDebit} onChange={(e) => setShowDebit(e.target.checked)} />
                        </Space>
                        <Divider/>
                        {showDebit && ledgerEntryFields("debit")}
                    </Col>
                    <Col xs={24} md={12}>
                        <Space direction="horizontal" align='center'>
                            <Title level={5} style={{ margin: 0 }}>Credit</Title>
                            <Checkbox value={showCredit} onChange={(e) => setShowCredit(e.target.checked)} />
                        </Space>
                        <Divider/>
                        {showCredit && ledgerEntryFields("credit")}
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default LedgerForm;