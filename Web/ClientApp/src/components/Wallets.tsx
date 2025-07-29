import React, { Component } from 'react';
import SummaryTable, {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {getWallets} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {Space, Typography} from "antd";

type WalletData = {
    id: string,
    name: string,
    headers: SummaryTableHeader[],
    data: SummaryTableRow[]
}

interface WalletsProps {}

interface WalletsState {
    wallets: WalletData[],
    loading: boolean
}

export class Wallets extends Component<WalletsProps, WalletsState> {
    static displayName = Wallets.name;

    state: WalletsState = {
        wallets: [],
        loading: true
    }

    componentDidMount() {
        this.populateData();
    }

    render() {
        let content = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div>
                <Space direction="vertical">
                    {this.state.wallets.map(wallet =>
                        <div>
                            <Space direction="vertical">
                                <Typography.Title level={3} style={{ margin: 0 }}>
                                    {wallet.name}
                                </Typography.Title>
                                <SummaryTable
                                    headers={wallet.headers}
                                    data={wallet.data}
                                    isEditable={true}
                                    onUpdate={this.updateComponent}
                                    onDelete={date => this.deleteEvaluations(wallet.id, date)}
                                />
                            </Space>
                        </div>
                    )}
                </Space>
            </div>
            
        return (
            [content]
        );
    }

    updateComponent = async (id: string, date: string, value: number) => {
        const response = await fetch("wallets/components/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: date,
                value: value
            }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await this.populateData();
    }

    deleteEvaluations = async (walletId: string, date: Date) => {
        const response = await fetch("wallets/" + walletId + '/' + date, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await this.populateData();
    }

    populateData = async () => {
        const response = await getWallets();
        
        let wallets : WalletData[] = response.wallets.map(wallet => {
            return {
                id: wallet.id,
                name: wallet.name,
                headers: wallet.headers,
                data: mapData(wallet.data)
            }
        })
        
        this.setState({ wallets: wallets, loading: false });
    }
}
