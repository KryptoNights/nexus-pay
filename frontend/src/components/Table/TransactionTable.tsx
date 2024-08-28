"use client";

import Layout from "@/components/Layout/Layout";
import { get_transaction_history } from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { divideByTenMillion } from "@/core/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Transaction {
  action: "sent" | "received";
  amount: number;
  gas_fee: number | undefined;
  sender?: string;
  success: boolean;
  version: number;
}

const TransactionTable: NextPage = () => {
  const totalpages = 10;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { activeAccountAdress, balance } = useSelector((state: any) => state.authSlice);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const offset = (currentPage - 1) * totalpages;
        const response = await get_transaction_history(
          activeAccountAdress,
          offset
        );
        console.log("Transaction history details:", response);
        setTransactions(response as Transaction[]);
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
      <h1 className="mb-8 text-4xl font-bold text-primary">Transactions</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          className="input input-bordered w-full max-w-md rounded-full bg-gray-800 text-white"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-800 text-primary">
              <th>Action</th>
              <th>Amount</th>
              <th>Sender</th>
              <th>Gas Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td>{transaction.action}</td>
                <td className="text-right">
                  {divideByTenMillion(transaction?.amount)?.toLocaleString()}{" "}
                  APT
                </td>
                <td className="truncate max-w-[200px]">
                  {transaction.sender || "N/A"}
                </td>
                <td>
                  {transaction.gas_fee !== undefined
                    ? divideByTenMillion(transaction.gas_fee)?.toLocaleString()
                    : "N/A"}
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
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => (
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
        <button className="btn btn-outline">Export</button>
      </div>
    </main>
  );
};

export default TransactionTable;
