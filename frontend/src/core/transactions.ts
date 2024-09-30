import { Account, AccountAddress } from '@aptos-labs/ts-sdk';
import { KeylessAccount } from "@aptos-labs/ts-sdk"
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import axios from 'axios';

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const testSendMoneyToAccount = async (address: string, signer: KeylessAccount, amount: number, type: string): Promise<string> => {
    if (address.includes("@") || address.includes(".")) {
        return testSendMoneyToId(address, "", signer, amount, type);
    }
    return sendCoinToAddres(
        AccountAddress.fromString(address),
        amount,
        type,
        signer
    )
}

export const testSendMoneyToId = async (id: string, id_token: string, signer: KeylessAccount, amount: number, type: string): Promise<string> => {
    const wallet = await get_wallet_from_nexus_id(id_token, id);
    return sendCoinToAddres(
        AccountAddress.fromString(wallet),
        amount,
        type,
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
                        { asset_type: { _eq: "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT" } },
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

    return committedTransactionResponse.hash;
}

export const sendStablePayment = async (recipient: AccountAddress, amount_usd: number, signer: KeylessAccount): Promise<string> => {
    const aptos_balance = await getBalances(signer.accountAddress.toString());
    const aptos_amount = aptos_balance.find((balance) => balance.asset_type === "0x1::aptos_coin::AptosCoin")?.amount;
    console.log(`Aptos balance: ${aptos_amount}`);
    const usdt_amount = aptos_balance.find((balance) => balance.asset_type === "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT")?.amount;
    console.log(`USDT balance: ${usdt_amount}`);
    // return Promise.resolve("0x0");

    if (usdt_amount < 1000000 * amount_usd) {
        console.log(`Aptos balance: ${aptos_amount}`);
        if (!aptos_amount) {
            throw new Error("No Aptos balance found");
        }
        const tx = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: "0x19b400ef28270cdd00ff826412a13b2e7d82a8a0762c46bed34a6e8d52f0275a::entry::swap_y_for_exact_x",
                typeArguments: [
                    "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT",
                    "0x1::aptos_coin::AptosCoin",
                    "0x19b400ef28270cdd00ff826412a13b2e7d82a8a0762c46bed34a6e8d52f0275a::bin_steps::X20"
                ],
                functionArguments: [
                    aptos_amount - 1000000,
                    (1000000 * amount_usd).toString(),
                ]
            }
        })

        const [userTransactionResponse] = await aptos.transaction.simulate.simple({
            signerPublicKey: signer.publicKey,
            transaction: tx
        });

        console.log(`step 0:`)
        console.log(userTransactionResponse);

        const senderAuthenticator = aptos.transaction.sign({
            signer: signer,
            transaction: tx,
        });

        const committedTransaction = await aptos.transaction.submit.simple({
            transaction: tx,
            senderAuthenticator,
        });

        const executedTransaction = await aptos.waitForTransaction({ transactionHash: committedTransaction.hash });
        console.log(`step 1`);
        console.log(executedTransaction);
    }

    // const hash = await sendCoinToAddres(recipient, amount_usd, "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT", signer);
    const hash = await testSendMoneyToAccount(recipient.toString(), signer, 1000000 * amount_usd, "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT");
    console.log(`step 2: Executed transaction: ${hash}`);

    return hash;
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
    return response.data.wallet;
}

export const get_nexus_id_from_wallet = async (id_token: string, wallet: string): Promise<any> => {
    const response = await axios.post(
        'https://nexus-fetch-id-for-wallet-876401151866.us-central1.run.app',
        {
            wallet: wallet
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${id_token}`
            },
        }
    );
    return response.data;
}

interface FungibleAssetActivity {
    amount: number;
    type: string;
    is_gas_fee: boolean;
    is_transaction_success: boolean;
    asset_type: string;
    transaction_version: number;
    transaction_timestamp: string;
}

interface AccountTransaction {
    transaction_version: string;
    user_transaction: {
        sender: string;
    };
}

interface TransactionHistory {
    version: string;
    action: string;
    amount: number;
    gas_fee?: number;
    success: boolean;
    sender?: string;
}

export const get_transaction_history = async (address: string, offset: number): Promise<TransactionHistory[]> => {
    try {
        const raw_fungible_asset_activities_response = await axios.post(
            'https://api.testnet.aptoslabs.com/v1/graphql',
            { 
                query: `
            query Fungible_asset_activities($orderBy: [fungible_asset_activities_order_by!], $where: fungible_asset_activities_bool_exp, $offset: Int, $limit: Int) {
                fungible_asset_activities(order_by: $orderBy, where: $where, offset: $offset, limit: $limit) {
                    transaction_timestamp
                    transaction_version
                    asset_type
                    amount
                    type
                    is_transaction_success
                    is_gas_fee
                }
            }
          `,
                variables: {
                    "orderBy": [
                      {
                        "transaction_timestamp": "desc"
                      }
                    ],
                    "where": {
                      "owner_address": {
                        "_eq": address
                      }
                    },
                    "offset": offset,
                    "limit": 15
                  },
                operationName: 'Fungible_asset_activities'
            },
            {
                headers: { 'content-type': 'application/json' }
            }
        );

        const raw_fungible_asset_activities: FungibleAssetActivity[] = raw_fungible_asset_activities_response.data.data.fungible_asset_activities;

        if (!raw_fungible_asset_activities || raw_fungible_asset_activities.length === 0) {
            console.log('No fungible asset activities found for the given address');
            return [];
        }

        const highest_tx_version = raw_fungible_asset_activities[0].transaction_version;

        const raw_account_transactions_response = await axios.post(
            'https://aptos-testnet.nodit.io/dveErbILsNrQJDb4i~SkzM0GyxAPn3p0/v1/graphql',
            {
                query: `
            query Fungible_asset_activities($where: account_transactions_bool_exp, $orderBy: [account_transactions_order_by!]) {
                account_transactions(where: $where, order_by: $orderBy) {
                    transaction_version
                    user_transaction {
                    sender
                    }
                }
            }
          `,
                variables: {
                    "where": {
                      "_and": [
                        {
                          "transaction_version": {
                            "_lte": highest_tx_version
                          },
                          "account_address": {
                            "_eq": address
                          }
                        }
                      ]
                    },
                    "orderBy": [
                      {
                        "transaction_version": "desc"
                      }
                    ]
                  },
                operationName: 'Fungible_asset_activities'
            },
            {
                headers: { 'content-type': 'application/json' }
            }
        ); 
        
        const raw_account_transactions: AccountTransaction[] = raw_account_transactions_response.data.data.account_transactions;

        const version_sender_map = new Map<string, string>();
        for (const transaction of raw_account_transactions) {
            version_sender_map.set(transaction.transaction_version, transaction.user_transaction.sender);
        }

        const version_activity_map = new Map<string, TransactionHistory>();
        for (const activity of raw_fungible_asset_activities) {
            const existingActivity: any = version_activity_map.get(activity.transaction_version as any as string) || {
                version: activity.transaction_version,
                transaction_timestamp: activity.transaction_timestamp,
                success: false,
                amount: 0,
            };

            if (activity.is_gas_fee) {
                existingActivity.gas_fee = activity.amount;
            }

            existingActivity.success = existingActivity.success || activity.is_transaction_success;

            if (activity.type.endsWith("DepositEvent")) {
                existingActivity.action = "Received";
                existingActivity.amount = activity.amount;
            } else if (activity.type.endsWith("WithdrawEvent")) {
                existingActivity.action = "Sent";
                existingActivity.amount = activity.amount;
            }

            existingActivity.sender = version_sender_map.get(activity.transaction_version as any as string);

            version_activity_map.set(activity.transaction_version as any as string, existingActivity);
        }

        const history: TransactionHistory[] = Array.from(version_activity_map.values());
        history.sort((a, b) => parseInt(b.version) - parseInt(a.version));

        return history.map((transaction) => {
            if (transaction.action === "Sent") {
                return {
                    ...transaction,
                    sender: "You",
                };
            }
            return transaction;
        });

        return history;
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
        }
        throw new Error('Failed to fetch transaction history');
    }
};

// export const get_transaction_history = async (address: string, offset: number): Promise<any> => {
//     const response = await axios.post(
//         'https://api.testnet.aptoslabs.com/v1/graphql',
//         {
//             'query': 'query User_transactions($where: fungible_asset_activities_bool_exp, $orderBy: [fungible_asset_activities_order_by!], $accountTransactionsWhere2: account_transactions_bool_exp, $accountTransactionsOrderBy2: [account_transactions_order_by!], $limit: Int, $fungibleAssetActivitiesLimit2: Int, $offset: Int, $accountTransactionsOffset2: Int) {\n  fungible_asset_activities(where: $where, order_by: $orderBy, limit: $fungibleAssetActivitiesLimit2, offset: $offset) {\n    amount\n    type\n    is_gas_fee\n    is_transaction_success\n    asset_type\n    transaction_version\n  }\n  account_transactions(where: $accountTransactionsWhere2, order_by: $accountTransactionsOrderBy2, limit: $limit, offset: $accountTransactionsOffset2) {\n    transaction_version\n    user_transaction {\n      sender\n    }\n  }\n}',
//             'variables': {
//                 'where': {
//                     'owner_address': {
//                         '_eq': address
//                     }
//                 },
//                 'orderBy': [
//                     {
//                         'transaction_timestamp': 'desc'
//                     }
//                 ],
//                 'accountTransactionsWhere2': {
//                     'account_address': {
//                         '_eq': address
//                     }
//                 },
//                 'accountTransactionsOrderBy2': [
//                     {
//                         'transaction_version': 'desc'
//                     }
//                 ],
//                 'limit': 15,
//                 'fungibleAssetActivitiesLimit2': 15,
//                 'offset': offset,
//                 'accountTransactionsOffset2': 0
//             },
//             'operationName': 'User_transactions'
//         },
//         {
//             headers: {
//                 'content-type': 'application/json'
//             }
//         }
//     );

//     const raw_fungible_asset_activities = response.data.data.fungible_asset_activities;
//     const raw_account_transactions = response.data.data.account_transactions as any[];
//     const versions = raw_fungible_asset_activities.map((activity: any) => {
//         return activity.transaction_version;
//     });
//     console.log(versions);

//     const version_sender_map: { [key: string]: string } = {};
//     for (let transaction of raw_account_transactions) {
//         version_sender_map[transaction.transaction_version as string] = transaction.user_transaction.sender;
//     }
//     // console.log(version_sender_map);

//     let version_activity_map: { [key: string]: any } = {};
//     for (let activity of raw_fungible_asset_activities) {
//         // console.log(version_activity_map[activity.transaction_version as string] || {});
//         version_activity_map[activity.transaction_version as string] = version_activity_map[activity.transaction_version as string] || {};

//         version_activity_map[activity.transaction_version as string].gas_fee = (activity.is_gas_fee as boolean) ? activity.amount as number : version_activity_map[activity.transaction_version as string].gas_fee;
//         version_activity_map[activity.transaction_version as string].success = activity.is_transaction_success as boolean || false;
        
//         if ((activity.type as string).endsWith("DepositEvent")) {
//             version_activity_map[activity.transaction_version as string].action = "Received";
//             version_activity_map[activity.transaction_version as string].amount = activity.amount;
//         } else if ((activity.type as string).endsWith("WithdrawEvent")) {
//             version_activity_map[activity.transaction_version as string].action = "Sent";
//             version_activity_map[activity.transaction_version as string].amount = activity.amount;
//         }
//         // console.log(version_activity_map[activity.transaction_version as string]);
//         // console.log("\n\n\n");
//         version_activity_map[activity.transaction_version as string].sender = version_sender_map[activity.transaction_version as string];
//     }

//     const history = [];
//     for (let version of versions) {
//         if (version_activity_map[version]) {
//             history.push({
//                 version,
//                 ...version_activity_map[version],
//             });
//         }
//     }

//     console.log(history);
//     return history;
// }