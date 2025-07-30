import React, {ReactNode, useState} from 'react';
import {Layout, Menu, MenuProps, Space, theme, Typography} from 'antd';
import {
    EuroCircleOutlined,
    LineChartOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
    WalletOutlined
} from "@ant-design/icons";

import {Wallets} from "./components/Wallets";
import Assets from "./components/Assets";
import Debts from "./components/Debts";
import PortfolioSummary from "./components/PortfolioSummary";
import WalletsSummary from './components/WalletsSummary';

const { Header, Content } = Layout;

interface NavBarItem {
    label: string,
    icon: ReactNode,
    component: ReactNode
}

const navBar: { [key: string]: NavBarItem} = {
    '/': {
        label: 'Portfolio Summary',
        icon: <LineChartOutlined />,
        component: <PortfolioSummary/>
    },
    '/wallets-summary': {
        label: 'Wallets Summary',
        icon: <LineChartOutlined />,
        component: <WalletsSummary/>
    },
    '/wallets': {
        label: 'Wallets',
        icon: <WalletOutlined />,
        component: <Wallets/>
    },
    '/assets': {
        label: 'Assets',
        icon: <PlusSquareOutlined />,
        component: <Assets/>
    },
    '/debts': {
        label: 'Debts',
        icon: <MinusSquareOutlined />,
        component: <Debts/>
    },
}

type MenuItem = Required<MenuProps>['items'][number];

const items : MenuItem[] = Object.keys(navBar).map(key => ({
    key,
    label: navBar[key].label,
    icon: navBar[key].icon,
}));

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [current, setCurrent] = useState(Object.keys(navBar)[0]);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Space>
                    <EuroCircleOutlined style={{ margin: 0, color: 'lightgray' }}/>
                    <Typography.Title level={3} style={{ margin: 0, color: 'lightgray' }}>
                        Finance Tracker
                    </Typography.Title>
                </Space>
                <Menu
                    theme="dark"
                    onClick={onClick} 
                    selectedKeys={[current]} 
                    mode="horizontal"
                    items={items}
                    style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
                />
            </Header>
            <Content style={{ padding: '24px 48px', flex: 1, minWidth: 0 }}>
                <div style={{ minWidth: 0, overflowX: 'auto' }}>
                    {navBar[current].component}
                </div>
            </Content>
        </Layout>
    );
};

export default App;