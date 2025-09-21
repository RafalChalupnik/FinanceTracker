import React, {ReactNode, useEffect, useState} from 'react';
import {Layout, Menu, MenuProps, Space, Typography} from 'antd';
import {
    EuroCircleOutlined, LineChartOutlined,
    SettingOutlined,
    WalletOutlined
} from "@ant-design/icons";

import PortfolioSummary from "./pages/PortfolioSummary";
import WalletsSummary from './pages/WalletsSummary';
import ConfigurationPage from "./pages/ConfigurationPage";
import {getConfiguration} from "./api/configuration/Client";
import PhysicalAllocation from "./pages/PhysicalAllocation";
import GroupPage from "./pages/GroupPage";
import DynamicIcon from "./components/DynamicIcon";

const { Header, Content } = Layout;

interface NavBarItem {
    label: string,
    icon?: ReactNode,
    component?: ReactNode,
    children?: { [key: string]: NavBarItem}
}

const navBarBeforeGroups: { [key: string]: NavBarItem} = {
    '/': {
        label: 'Portfolio Summary',
        icon: <LineChartOutlined />,
        component: <PortfolioSummary/>
    },
    '/wallets-summary': {
        label: 'Wallets Summary',
        icon: <LineChartOutlined />,
        component: <WalletsSummary/>
    }
}

const navBarAfterGroups: { [key: string]: NavBarItem} = {
    '/physical-allocations': {
        label: 'Physical Allocations',
        icon: <WalletOutlined />,
    },
    '/config': {
        label: 'Configuration',
        icon: <SettingOutlined />,
        component: <ConfigurationPage/>
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
        const config = await getConfiguration();

        const groupTypesItems: { [key: string]: NavBarItem } = config.groupTypes.reduce(
            (acc, groupType) => {
                acc[groupType.name] = {
                    label: groupType.name,
                    icon: <DynamicIcon name={groupType.icon} />,
                    children: groupType.groups.reduce((childAcc, group) => {
                        childAcc[`/groups:${group.key}`] = {
                            label: group.name,
                            component: (
                                <GroupPage
                                    key={group.key}
                                    groupId={group.key}
                                    name={group.name}
                                />
                            ),
                        };
                        return childAcc;
                    }, {} as Record<string, NavBarItem>),
                };
                return acc;
            },
            {} as Record<string, NavBarItem>
        );
        
        let navBar = {
            ...navBarBeforeGroups,
            ...groupTypesItems,
            ...navBarAfterGroups,
        }

        navBar['/physical-allocations'].children = config.physicalAllocations.reduce((acc, allocation) => {
            acc[`/physical-allocations:${allocation.key}`] = {
                label: allocation.name,
                component: (
                    <PhysicalAllocation
                        key={allocation.key}
                        allocationId={allocation.key}
                        name={allocation.name}
                    />
                )
            };
            return acc;
        }, {} as Record<string, NavBarItem>);
        
        setNavBar(navBar);
        setCurrentKey(Object.keys(navBar)[0])
        setCurrentComponent(navBar[Object.keys(navBar)[0]].component)
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
                    <Typography.Title level={3} style={{ margin: 0, color: 'lightgray' }}>
                        <EuroCircleOutlined style={{ margin: 0, color: 'lightgray', paddingRight: '10px' }}/>
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