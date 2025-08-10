import React, {ReactNode, useEffect, useState} from 'react';
import {Layout, Menu, MenuProps, Space, theme, Typography} from 'antd';
import {
    EuroCircleOutlined,
    LineChartOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
    SettingOutlined,
    WalletOutlined
} from "@ant-design/icons";

import Assets from "./pages/Assets";
import Debts from "./pages/Debts";
import PortfolioSummary from "./pages/PortfolioSummary";
import WalletsSummary from './pages/WalletsSummary';
import Wallets from "./pages/Wallets";
import Configuration from "./pages/Configuration";
import {getWallets} from "./api/configuration/Client";

const { Header, Content } = Layout;

interface NavBarItem {
    label: string,
    icon?: ReactNode,
    component?: ReactNode,
    children?: { [key: string]: NavBarItem}
}

const navBarTemplate: { [key: string]: NavBarItem} = {
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
    '/config': {
        label: 'Configuration',
        icon: <SettingOutlined />,
        component: <Configuration/>
    },
}

type MenuItem = Required<MenuProps>['items'][number];

const mapMenuItems = (items: { [key: string]: NavBarItem}): MenuItem[] =>
    Object.keys(items).map(key =>
        ({
            key,
            label: items[key].label,
            icon: items[key].icon,
            children: items[key].children !== undefined ? mapMenuItems(items[key].children!) : undefined
        }));



const App: React.FC = () => {
    const [navBar, setNavBar] = useState<{ [key: string]: NavBarItem} | undefined>(undefined);
    const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
    const [currentComponent, setCurrentComponent] = useState<ReactNode | undefined>();

    const populateData = async () => {
        const wallets = await getWallets();

        navBarTemplate['/wallets'].children = wallets.reduce((acc, wallet) => {
            acc[`/wallets:${wallet.key}`] = {
                label: wallet.name,
                component: <Wallets key={wallet.key} walletId={wallet.key} />
            };
            return acc;
        }, {} as Record<string, NavBarItem>);
        
        setNavBar(navBarTemplate);
        setCurrentKey(Object.keys(navBarTemplate)[0])
        setCurrentComponent(navBarTemplate[Object.keys(navBarTemplate)[0]].component)
    }

    useEffect(() => {
        populateData()
    }, [])
    
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrentKey(e.key);
        
        let currentItem = navBar!;
        
        for (let i = e.keyPath.length - 1; i >= 1; i--) {
            currentItem = currentItem[e.keyPath[i]].children!;
        }
        
        setCurrentComponent(currentItem[e.key].component);
    };

    const items : MenuItem[] = navBar !== undefined
        ? mapMenuItems(navBar)
        : [];
    
    return navBar === undefined
        ? (<>Loading...</>)
        : (
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
                    selectedKeys={[currentKey!]} 
                    mode="horizontal"
                    items={items}
                    style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
                />
            </Header>
            <Content style={{ padding: '24px 48px', flex: 1, minWidth: 0 }}>
                <div style={{ minWidth: 0, overflowX: 'auto' }}>
                    {currentComponent}
                </div>
            </Content>
        </Layout>
    );
};

export default App;