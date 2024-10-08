import { sendStablePayment } from "@/core/transactions";
import mixpanel from "mixpanel-browser";

export const sendStableMoneyFunc = async (
  recipientAddress: any,
  transferAmount: any,
  activeAccount: any
) => {
  mixpanel.track("payment_approval_initiated");
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
      console.log("tx has executed", hash);
    } else if (typeof hash === "object") {
      console.log(
        "tx has only simulated",
        hash.apt_deducted,
        hash.usdt_deducted,
        hash.usdt_per_apt,
        hash.gas_used
      );
    }
    console.log(hash);
  } catch (error) {
    console.error("Failed to send money:", error);
  } finally {
  }
};
