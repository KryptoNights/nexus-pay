"use client";

import Layout from "@/components/Layout/Layout";
import { get_transaction_history } from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { collapseAddress, convertOctaToApt } from "@/core/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Transaction {
  version: string;
  action: string;
  amount: number;
  gas_fee?: number;
  success: boolean;
  sender?: string;
}

const TransactionTable: NextPage = () => {
  const totalpages = 10;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { activeAccountAdress, balance } = useSelector(
    (state: any) => state.authSlice
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * totalpages;
        const response = await get_transaction_history(
          activeAccountAdress,
          offset
        );
        console.log("Transaction history details:", response);
        setTransactions(response as Transaction[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    if (activeAccountAdress) {
      fetchTransactionHistory();
    }
  }, [activeAccountAdress, currentPage, balance]);

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm?.toLowerCase();
    return (
      (transaction?.sender &&
        transaction?.sender?.toLowerCase().includes(searchLower)) ||
      transaction?.action?.toLowerCase().includes(searchLower) ||
      (transaction.success ? "success" : "failed").includes(searchLower)
    );
  });

  return (
    <main className="flex-grow px-4 text-center">
      <h1 className="mt-3 mb-8 text-4xl font-bold text-primary">
        Transactions
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          className="input input-bordered w-full max-w-md rounded-full bg-gray-800 text-white"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div
        className="overflow-x-auto"
        style={{ overflowY: "scroll", height: "400px" }}
      >
        <table className="table w-full">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr className="bg-gray-800 text-primary">
              <th>Action</th>
              <th>Amount</th>
              <th>Sender</th>
              <th>Txn Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          {!loading ? (
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td>{transaction.action}</td>
                  <td className="text-center">
                    {transaction.action === "Sent"
                      ? `- ${convertOctaToApt(transaction?.amount)} APT`
                      : `+ ${convertOctaToApt(transaction?.amount)} APT`}
                  </td>
                  <td className="truncate max-w-[200px]">
                    {collapseAddress(transaction?.sender || "") || "N/A"}
                  </td>
                  <td>
                    {transaction.version !== undefined ? (
                      <a
                        href={`https://explorer.aptoslabs.com/txn/${transaction?.version}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline" }}
                      >
                        {transaction?.version}
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${transaction.success ? "badge-success" : "badge-error"}`}
                    >
                      {transaction.success ? "Success" : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <div
              role="status"
              className="w-[100vh] flex justify-center items-center"
            >
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </table>
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-wrap justify-center mt-4 space-x-2">
        {Array.from({ length: totalpages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`btn btn-sm ${
              currentPage === page ? "btn-primary" : "btn-ghost"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4 mb-10">
        <button
          className="btn btn-primary"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          New Transaction
        </button>
        {/* <button className="btn btn-outline">Export</button> */}
      </div>
    </main>
  );
};

export default TransactionTable;
