import React, {ReactNode, useEffect, useState} from 'react';
import {Layout, Menu, MenuProps, Space, Typography} from 'antd';
import {
    LineChartOutlined,
    SettingOutlined,
    WalletOutlined
} from "@ant-design/icons";

import PortfolioSummary from "./pages/PortfolioSummary";
import ConfigurationPage from "./pages/ConfigurationPage";
import {getConfiguration} from "./api/configuration/Client";
import PhysicalAllocation from "./pages/PhysicalAllocation";
import GroupPage from "./pages/GroupPage";
import DynamicIcon from "./components/DynamicIcon";
import GroupTypePage from "./pages/GroupTypePage";
import {GroupTypeConfigDto} from "./api/configuration/DTOs/ConfigurationDto";

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
        
        const mapGroupTypeChildren = (groupType: GroupTypeConfigDto) => {
            if (groupType.groups.length === 1) {
                let group = groupType.groups[0];
                
                return ({
                    label: groupType.name,
                    icon: <DynamicIcon name={groupType.icon} />,
                    component: <GroupPage
                        key={group.key}
                        groupId={group.key}
                        name={group.name}
                        showTargets={group.showTargets}
                    />
                });
            }
            
            return ({
                label: groupType.name,
                icon: <DynamicIcon name={groupType.icon} />,
                component: <GroupTypePage key={groupType.key} groupType={groupType} />,
                children: {
                    ...({
                        [`/groups:${groupType.key}`]: {
                            label: 'Summary',
                            component: <GroupTypePage key={groupType.key} groupType={groupType} />,
                        },
                    }),
                    ...groupType.groups.reduce((childAcc, group) => {
                        childAcc[`/groups:${group.key}`] = {
                            label: group.name,
                            component: (
                                <GroupPage
                                    key={group.key}
                                    groupId={group.key}
                                    name={group.name}
                                    showTargets={group.showTargets}
                                />
                            ),
                        };
                        return childAcc;
                    }, {} as Record<string, NavBarItem>)
                },
            });
        }

        const groupTypesItems: { [key: string]: NavBarItem } = config.groupTypes.reduce(
            (acc, groupType) => {
                acc[groupType.name] = mapGroupTypeChildren(groupType)
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
                        <img
                            src='/icon.png'
                            alt="Finance Icon"
                            style={{
                                width: "1em",          // same scale as AntD icons
                                height: "1em",
                                transform: "scale(1.5)", // zoom to 150%
                                transformOrigin: "center",
                                verticalAlign: "middle",
                                marginBottom: "5px",
                                marginRight: "10px",   // replaces paddingRight
                                filter: "grayscale(1) brightness(1.2)", // optional: tint to lightgray like your original icon
                            }}
                        />
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
