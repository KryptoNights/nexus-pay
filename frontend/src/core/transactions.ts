import { Account, AccountAddress } from '@aptos-labs/ts-sdk';
import { KeylessAccount } from "@aptos-labs/ts-sdk"
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import axios from 'axios';

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const testSendMoneyToAccount = async (address: string, signer: KeylessAccount, amount: number): Promise<string> => {
    console.log("Address: ", address);
    console.log("Amount: ", amount);
    if (address.includes("@") || address.includes(".")) {
        return testSendMoneyToId(address, "", signer, amount);
    }
    return sendCoinToAddres(
        AccountAddress.fromString(address),
        amount,
        "0x1::aptos_coin::AptosCoin",
        signer
    )
}

export const testSendMoneyToId = async (id: string, id_token: string, signer: KeylessAccount, amount: number): Promise<string> => {
    const wallet = await get_wallet_from_nexus_id(id_token, id);
    return sendCoinToAddres(
        AccountAddress.fromString(wallet),
        amount,
        "0x1::aptos_coin::AptosCoin",
        signer
    )
}

export const getBalances = async (address: string): Promise<{
    asset_type: any;
    amount: any;
}[]> => {
    try {
        let all_balances = await aptos.getCurrentFungibleAssetBalances({
            options: {
                where: {
                    owner_address: { _eq: address },
                    _or: [
                        { asset_type: { _eq: "0x1::aptos_coin::AptosCoin" } },
                    ]
                },
            }
        });

        const balances = all_balances.map((balance: any) => {
            return {
                asset_type: balance.asset_type,
                amount: balance.amount
            }
        })

        return balances;
    } catch (error) {
        return [
            {
                asset_type: "0x1::aptos_coin::AptosCoin",
                amount: 0
            }
        ]
    }
}

export const sendCoinToAddres = async (recipient: AccountAddress, amount: number, type: string, signer: KeylessAccount): Promise<string> => {
    const parts = type.split("::");
    if (parts.length !== 3) {
        throw new Error("Invalid coin type, should be in the format of '0x1::aptos_coin::AptosCoin'");
    }

    const transaction = await aptos.transferCoinTransaction({
        sender: signer.accountAddress,
        recipient: recipient,
        amount: amount,
        coinType: `${parts[0]}::${parts[1]}::${parts[2]}`,
    });

    const committedTxn = await aptos.signAndSubmitTransaction({ signer: signer, transaction });
    const committedTransactionResponse = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("HASH: ", committedTransactionResponse);

    return committedTransactionResponse.hash;
}

export const get_nexus_ids_starting_with = async (id_token: string, raw_query_string: string): Promise<string[]> => {
    let query_string = raw_query_string.trim();
    if (query_string.includes("@")) {
        query_string = query_string.split("@")[0];
    }
    if (query_string.includes(".")) {
        query_string = query_string.split(".")[0];
    }

    const response = await axios.post(
        'https://nexus-query-startswith-7kxt74l7iq-uc.a.run.app',
        {
            query: query_string,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${id_token}`,
            },
        }
    );
    console.log(response);

    return response.data.emails;
};

export const get_wallet_from_nexus_id = async (id_token: string, nexus_id: string): Promise<string> => {
    const response = await axios.post(
        'https://nexus-fetch-wallet-for-id-7kxt74l7iq-uc.a.run.app',
        {
            nexus_id: nexus_id
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${id_token}`
            },
        }
    );
    console.log(response);
    return response.data.wallet;
}

export const get_transaction_history = async (address: string, offset: number): Promise<any> => {
    const response = await axios.post(
        'https://api.testnet.aptoslabs.com/v1/graphql',
        {
            'query': 'query User_transactions($where: fungible_asset_activities_bool_exp, $orderBy: [fungible_asset_activities_order_by!], $accountTransactionsWhere2: account_transactions_bool_exp, $accountTransactionsOrderBy2: [account_transactions_order_by!], $limit: Int, $fungibleAssetActivitiesLimit2: Int, $offset: Int, $accountTransactionsOffset2: Int) {\n  fungible_asset_activities(where: $where, order_by: $orderBy, limit: $fungibleAssetActivitiesLimit2, offset: $offset) {\n    amount\n    type\n    is_gas_fee\n    is_transaction_success\n    asset_type\n    transaction_version\n  }\n  account_transactions(where: $accountTransactionsWhere2, order_by: $accountTransactionsOrderBy2, limit: $limit, offset: $accountTransactionsOffset2) {\n    transaction_version\n    user_transaction {\n      sender\n    }\n  }\n}',
            'variables': {
                'where': {
                    'owner_address': {
                        '_eq': address
                    }
                },
                'orderBy': [
                    {
                        'transaction_timestamp': 'desc'
                    }
                ],
                'accountTransactionsWhere2': {
                    'account_address': {
                        '_eq': address
                    }
                },
                'accountTransactionsOrderBy2': [
                    {
                        'transaction_version': 'desc'
                    }
                ],
                'limit': 15,
                'fungibleAssetActivitiesLimit2': 15,
                'offset': offset,
                'accountTransactionsOffset2': 0
            },
            'operationName': 'User_transactions'
        },
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    );

    const raw_fungible_asset_activities = response.data.data.fungible_asset_activities;
    const raw_account_transactions = response.data.data.account_transactions as any[];
    const versions = raw_fungible_asset_activities.map((activity: any) => {
        return activity.transaction_version;
    });
    console.log(versions);

    const version_sender_map: { [key: string]: string } = {};
    for (let transaction of raw_account_transactions) {
        version_sender_map[transaction.transaction_version as string] = transaction.user_transaction.sender;
    }
    // console.log(version_sender_map);

    let version_activity_map: { [key: string]: any } = {};
    for (let activity of raw_fungible_asset_activities) {
        // console.log(version_activity_map[activity.transaction_version as string] || {});
        version_activity_map[activity.transaction_version as string] = version_activity_map[activity.transaction_version as string] || {};

        version_activity_map[activity.transaction_version as string].gas_fee = (activity.is_gas_fee as boolean) ? activity.amount as number : version_activity_map[activity.transaction_version as string].gas_fee;
        version_activity_map[activity.transaction_version as string].success = activity.is_transaction_success as boolean || false;
        
        if ((activity.type as string).endsWith("DepositEvent")) {
            version_activity_map[activity.transaction_version as string].action = "received";
            version_activity_map[activity.transaction_version as string].amount = activity.amount;
        } else if ((activity.type as string).endsWith("WithdrawEvent")) {
            version_activity_map[activity.transaction_version as string].action = "sent";
            version_activity_map[activity.transaction_version as string].amount = activity.amount;
        }
        // console.log(version_activity_map[activity.transaction_version as string]);
        // console.log("\n\n\n");
        version_activity_map[activity.transaction_version as string].sender = version_sender_map[activity.transaction_version as string];
    }

    const history = [];
    for (let version of versions) {
        if (version_activity_map[version]) {
            history.push({
                version,
                ...version_activity_map[version],
            });
        }
    }

    console.log(history);
    return history;
}