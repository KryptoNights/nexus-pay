import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import { collapseAddress } from "@/core/utils";
import GoogleLogo from "public/assets/GoogleLogo";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import Head from "next/head";
import Layout from "@/components/Layout/Layout";
import { useDispatch } from "react-redux";
import { setActiveAccountAddress } from "@/redux/reducers/authReducer";
import { testSendMoneyToAccount, getBalances } from "@/core/transactions";

function TestSendMoney() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { activeAccount, disconnectKeylessAccount, getKeylessAccount } =
    useKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) router.push("/login");
  }, [activeAccount]);

  return (
    <Layout>
      <Head>
        <title>Send money</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center h-[100%] px-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Nexus Pay!</h1>
          <p className="text-lg mb-8">You are now logged in</p>

          <div className="grid gap-2">
            {activeAccount ? (
              <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                <GoogleLogo />
                {collapseAddress(activeAccount?.accountAddress.toString())}
              </div>
            ) : (
              <p>Not logged in</p>
            )}
            <button
              className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
              onClick={disconnectKeylessAccount}
            >
              Logout
            </button>
          </div>
        </div>
        <button
          className="flex justify-center bg-green-50 items-center border border-green-200 rounded-lg px-8 py-2 shadow-sm shadow-green-300 hover:bg-green-100 active:scale-95 transition-all mt-8"
          onClick={async () => {
            const address = prompt("Enter the address to send money to");
            if (address) {
              const transactionHash = await testSendMoneyToAccount(
                address,
                activeAccount!,
                5000000
              );
              alert(
                `Transaction successful! Transaction hash: ${transactionHash}`
              );
            }
          }}
        >
          Send money
        </button>
        <button
          className="flex justify-center bg-green-50 items-center border border-green-200 rounded-lg px-8 py-2 shadow-sm shadow-green-300 hover:bg-green-100 active:scale-95 transition-all mt-8"
          onClick={async () => {
            const getBalancesResponse = await getBalances(
              activeAccount!.accountAddress.toString()
            );
            // alert(`Balances: ${JSON.stringify(getBalancesResponse)}`);
            let text = "";
            getBalancesResponse.forEach((balance) => {
              text += `You have ${balance.amount} of ${balance.asset_type.split("::")[2]}\n`;
            });
            alert(text);
          }}
        >
          Check Balance
        </button>
      </div>
    </Layout>
  );
}

export default TestSendMoney;
