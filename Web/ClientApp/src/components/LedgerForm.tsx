import React, { useEffect } from "react";
import {Modal, Form, DatePicker, Select, Row, Col, Typography, Space, Checkbox, Divider, Alert} from "antd";
import { TransactionDto } from "../api/ledger/DTOs/TransactionDto";
import dayjs from "dayjs";
import InputMoney from "./money/InputMoney";

const { Title } = Typography;

// Component props
interface LedgerFormProps {
    open: boolean;
    initialValue?: TransactionDto;
    onSubmit: (t: TransactionDto) => void;
    onCancel: () => void;
    componentOptions: { label: string; value: string }[];
    allocationOptions: { label: string; value: string }[];
}

const LedgerForm : React.FC<LedgerFormProps> = (props) => {
    const [form] = Form.useForm();
    const [showDebit, setShowDebit] = React.useState(false);
    const [showCredit, setShowCredit] = React.useState(false);
    const [alertVisible, setAlertVisible] = React.useState(false);
    
    const reset = () => {
        form.resetFields();
        setShowDebit(false);
        setShowCredit(false);
        setAlertVisible(false);
    }

    useEffect(() => {
        if (props.initialValue) {
            form.setFieldsValue({
                key: props.initialValue.key,
                date: dayjs(props.initialValue.date),
                debit: props.initialValue.debit,
                credit: props.initialValue.credit,
            });
            setShowDebit(props.initialValue.debit !== null);
            setShowCredit(props.initialValue.credit !== null);
        } else {
            reset();
        }
    }, [props.initialValue, form]);

    const handleOk = () => {
        if (!showDebit && !showCredit) {
            setAlertVisible(true);
            return;
        }
        
        form
            .validateFields()
            .then((values) => {
                const transaction: TransactionDto = {
                    key: props.initialValue?.key ?? crypto.randomUUID(),
                    date: dayjs(values.date).format("YYYY-MM-DD"),
                    debit: showDebit
                        ? ({
                            ...values.debit,
                            value: {
                                amount: -Math.abs(values.debit.value.amount),
                                currency: values.debit.value.currency,
                                amountInMainCurrency: -Math.abs(values.debit.value.amountInMainCurrency),
                            }
                        })
                        : undefined,
                    credit: showCredit
                        ? ({
                            ...values.credit,
                            value: {
                                amount: Math.abs(values.credit.value.amount),
                                currency: values.credit.value.currency,
                                amountInMainCurrency: Math.abs(values.credit.value.amountInMainCurrency),
                            }
                        })
                        : undefined,
                };
                console.log(transaction);
                props.onSubmit(transaction);
                reset();
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
            onCancel={() => {
                reset();
                props.onCancel();
            }}
            onOk={handleOk}
            okText="Save"
        >
            {alertVisible && <Alert message="Select at least one from debit or credit" type="error" />}
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item name="date" label="Date" initialValue={dayjs()} rules={[{ required: true, message: "Pick a date" }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Space direction="horizontal" align='center'>
                            <Title level={5} style={{ margin: 0 }}>Debit</Title>
                            <Checkbox checked={showDebit} onChange={(e) => setShowDebit(e.target.checked)} />
                        </Space>
                        <Divider/>
                        {showDebit && ledgerEntryFields("debit")}
                    </Col>
                    <Col xs={24} md={12}>
                        <Space direction="horizontal" align='center'>
                            <Title level={5} style={{ margin: 0 }}>Credit</Title>
                            <Checkbox checked={showCredit} onChange={(e) => setShowCredit(e.target.checked)} />
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