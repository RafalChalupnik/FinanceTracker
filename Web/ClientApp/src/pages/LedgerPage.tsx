import React from 'react';
import Ledger from "../components/Ledger";
import {Col, Row} from "antd";
import LedgerSummary from "../components/LedgerSummary";

const LedgerPage: React.FC = () => {
    return (
        <Row
            style={{
                height: "100vh",   // Row fills viewport
                padding: 16
            }}
            gutter={16}
        >
            {/* Fixed column */}
            <Col flex="auto">
                <LedgerSummary />
            </Col>

            {/* Scrollable column */}
            <Col
                flex="auto"
                style={{
                    overflow: "auto",
                    height: "100%",   // enables scrolling
                }}
            >
                <Ledger />
            </Col>
        </Row>
    );
}

export default LedgerPage;