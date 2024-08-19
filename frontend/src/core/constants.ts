// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

/**
 * [FIX ME]
 * Replace the Google client_id below with your own.
 * Authorized JavaScript origins: https://pwsfs8-5173.csb.app
 * Authorized redirect URIs: https://pwsfs8-5173.csb.app/callback
 */
export const GOOGLE_CLIENT_ID =
  "876401151866-eh0r26s88b9r2ef55m4ium8f4k3r2q6j.apps.googleusercontent.com";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.DEVNET }),
);

export const testnetClient = new Aptos(
  new AptosConfig({ network: Network.TESTNET }),
)
