import Layout from "@/components/Layout/Layout";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const TransactionTable: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
  };

  return (
    <main className=" flex-grow px-4 text-center">
      <h1 className="mb-8 text-4xl font-bold text-primary">Transactions</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          className="input input-bordered w-full max-w-md rounded-full bg-gray-800 text-white"
          onChange={(e) => console.log(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-800 text-primary">
              <th>Transaction ID</th>
              <th>Address</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: "97412378923",
                address: "Microsoft Corporation",
                date: "14 Jan 2022",
                amount: 15792,
                status: "Pending",
              },
              {
                id: "97412378923",
                address: "Tesla Inc.",
                date: "01 Feb 2022",
                amount: 275,
                status: "Pending",
              },
              {
                id: "97412378923",
                address: "Coca Cola co.",
                date: "14 Jan 2022",
                amount: 8950500,
                status: "Pending",
              },
              {
                id: "97412378923",
                address: "Nvidia Corporation",
                date: "14 Jan 2022",
                amount: 98218,
                status: "Pending",
              },
            ].map((transaction, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td>{transaction.id}</td>
                <td>{transaction.address}</td>
                <td>{transaction.date}</td>
                <td className="text-right">
                  ${transaction.amount.toLocaleString()}
                </td>
                <td>
                  <span className="badge badge-primary">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button className="btn btn-primary" onClick={() => {
          router.push("/");
        }}>New Transaction</button>
        <button className="btn btn-outline">Export</button>
      </div>
    </main>
  );
};

export default TransactionTable;
