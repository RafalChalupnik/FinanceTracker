import React, {Component, FC, useEffect, useState} from 'react';
import SummaryTable, {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {getWallets, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {Space, Typography} from "antd";

type WalletData = {
    id: string,
    name: string,
    headers: SummaryTableHeader[],
    data: SummaryTableRow[]
}

interface WalletsProps {}

const Wallets: FC<WalletsProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [wallets, setWallets] = useState([] as WalletData[]);

    const populateData = async () => {
        const response = await getWallets();

        let wallets : WalletData[] = response.wallets.map(wallet => {
            return {
                id: wallet.id,
                name: wallet.name,
                headers: wallet.headers,
                data: mapData(wallet.data)
            }
        })
        
        setWallets(wallets)
        setIsLoading(false)
    }

    useEffect(() => {
        populateData()
    })

    const updateComponent = async (id: string, date: string, value: MoneyDto) => {
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
    }

    const deleteEvaluations = async (walletId: string, date: Date) => {
        const response = await fetch("wallets/" + walletId + '/' + date, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }

    return isLoading
        ? <p><em>Loading...</em></p>
        : (<div>
            <Space direction="vertical">
                {wallets.map(wallet =>
                    <div>
                        <Space direction="vertical">
                            <Typography.Title level={3} style={{ margin: 0 }}>
                                {wallet.name}
                            </Typography.Title>
                            <SummaryTable
                                headers={wallet.headers}
                                data={wallet.data}
                                editable={{
                                    refreshData: async () => {
                                        const response = await getWallets();
                                        return mapData(response.wallets
                                            .find(w => w.id === wallet.id)!
                                            .data)
                                    },
                                    onUpdate: updateComponent,
                                    onDelete: date => deleteEvaluations(wallet.id, date),
                                }}
                            />
                        </Space>
                    </div>
                )}
            </Space>
        </div>
        );
}

export default Wallets;