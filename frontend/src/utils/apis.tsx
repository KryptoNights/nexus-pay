import { sendStablePayment, testSendMoneyToAccount } from "@/core/transactions";
import { convertAptToOcta } from "@/core/utils";
import mixpanel from "mixpanel-browser";

export const sendStableMoneyFunc = async (
  recipientAddress: any,
  transferAmount: any,
  activeAccount: any
) => {
  try {
    if (!recipientAddress) {
      throw new Error("Active account is not provided.");
    }

    const hash = await sendStablePayment(
      recipientAddress,
      transferAmount,
      activeAccount!,
      false
    );
    if (typeof hash === "string") {
      // console.log("tx has executed", hash);
    } else if (typeof hash === "object") {
      // console.log(
      //   "tx has only simulated",
      //   hash.apt_deducted,
      //   hash.usdt_deducted,
      //   hash.usdt_per_apt,
      //   hash.gas_used
      // );
    }
    // console.log(hash);
  } catch (error) {
    console.error("Failed to send money:", error);
  } finally {
  }
};

export const sendMoney = async (
  recipientAddress: any,
  transferAmount: any,
  activeAccount: any,
  setTransferError:any
) => {
  try {
    if (!recipientAddress) {
      throw new Error("Active account is not provided.");
    }

    const transactionHash = await testSendMoneyToAccount(
      recipientAddress,
      activeAccount!,
      convertAptToOcta(transferAmount),
      "0x1::aptos_coin::AptosCoin"
    );
    // console.log(transactionHash);

  } catch (error: any) {
    const vmStatus = error?.transaction?.vm_status || "";

    if (
      vmStatus.includes("INSUFFICIENT_BALANCE") ||
      vmStatus.includes("Not enough coins")
    ) {
      setTransferError("Not Enough Balance");
    } else {
      setTransferError("Transaction failed. Please try again.");
    }

    console.error("Failed to send money:", vmStatus);
    mixpanel.track("failed to send money", { error });
  } finally {
  }
};
