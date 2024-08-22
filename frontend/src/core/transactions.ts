import { Account, AccountAddress } from '@aptos-labs/ts-sdk';
import { KeylessAccount } from "@aptos-labs/ts-sdk"
import {Aptos, AptosConfig, Network} from '@aptos-labs/ts-sdk';
import axios from 'axios';

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const testSendMoneyToAccount = async (address: string, signer: KeylessAccount): Promise<string> => {
    const transaction = await aptos.transferCoinTransaction({
        sender: signer.accountAddress,
        recipient: AccountAddress.fromString(address),
        amount: 100000000,
    });

    const committedTxn = await aptos.signAndSubmitTransaction({ signer: signer, transaction });

    const committedTransactionResponse = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("HASHHHHHH");
    console.log(committedTransactionResponse);

    return committedTransactionResponse.hash;
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
                        {asset_type: { _eq: "0x1::aptos_coin::AptosCoin" } },
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

export const sendCoin = async (recipient: AccountAddress, amount: number, type: string, signer: KeylessAccount): Promise<string> => {
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

export const get_nexus_ids_starting_with = async (id_token: string, query_string: string): Promise<string[]> => {
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
  