import { Account, AccountAddress } from '@aptos-labs/ts-sdk';
import { KeylessAccount } from "@aptos-labs/ts-sdk"
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { get_wallet_from_nexus_id } from './transactions';

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const testSendMoneyToAccount = async (address: string, signer: KeylessAccount): Promise<string> => {
    if (address.includes("@") || address.includes(".")) {
        return testSendMoneyToId(address, "", signer);
    }
    return sendCoinToAddres(
        AccountAddress.fromString(address),
        5000,
        "0x1::aptos_coin::AptosCoin",
        signer
    )
}

export const testSendMoneyToId = async (id: string, id_token: string, signer: KeylessAccount): Promise<string> => {
    const wallet = await get_wallet_from_nexus_id(id_token, id);
    return sendCoinToAddres(
        AccountAddress.fromString(wallet),
        5000,
        "0x1::aptos_coin::AptosCoin",
        signer
    )
}

export const getBalances = async (address: string): Promise<{
    asset_type: any;
    amount: any;
} | null> => {
    try {
        const all_balances = await aptos.getCurrentFungibleAssetBalances({
            options: {
                where: {
                    owner_address: { _eq: address },
                    _or: [
                        { asset_type: { _eq: "0x1::aptos_coin::AptosCoin" } },
                    ]
                },
            }
        });

        // Return the first balance found, or null if no balances are available
        if (all_balances.length > 0) {
            return {
                asset_type: all_balances[0].asset_type,
                amount: all_balances[0].amount,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching balances:", error);
        return null;
    }
};

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