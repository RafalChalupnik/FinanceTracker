import React, {FC, useEffect, useState} from 'react';
import {SummaryComponent, SummaryRecord} from "../SummaryDataTypes";
import {getWallets, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {Space, Typography} from "antd";
import EditableMoneyTable from "../components/EditableMoneyTable";

type WalletData = {
    id: string,
    name: string,
    headers: SummaryComponent[],
    data: SummaryRecord[]
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

    const deleteEvaluations = async (walletId: string, date: string) => {
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
                    <EditableMoneyTable
                        title={wallet.name}
                        rows={wallet.data}
                        columns={wallet.headers}
                        editable={{
                            onUpdate: updateComponent,
                            onDelete: date => deleteEvaluations(wallet.id, date),
                        }}
                    />
                )}
            </Space>
        </div>
        );
}

export default Wallets;