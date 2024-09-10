"use client";

import Layout from "@/components/Layout/Layout";
import { get_transaction_history } from "@/core/transactions";
import { collapseAddress, convertOctaToApt, formatDate } from "@/core/utils";
import type { NextPage } from "next";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Info } from "lucide-react";
import debounce from "lodash/debounce"; // Add this import

interface Transaction {
  version: string;
  action: string;
  transaction_timestamp: string;
  amount: number;
  gas_fee?: number;
  success: boolean;
  sender?: string;
}

const TransactionTable: NextPage = () => {
  const totalpages = 10;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const lastTransactionElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isInitialLoad) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isInitialLoad]
  );

  const { activeAccountAdress, balance } = useSelector(
    (state: any) => state.authSlice
  );

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 400),
    []
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
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
        if (response.length === 0) {
          setHasMore(false);
        } else {
          setTransactions((prevTransactions) => [
            ...prevTransactions,
            ...(response as Transaction[]),
          ]);
        }
        setLoading(false);
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (activeAccountAdress && (isInitialLoad || hasMore)) {
      fetchTransactionHistory();
    }
  }, [activeAccountAdress, currentPage, balance, isInitialLoad, hasMore]);

  // Update filteredTransactions to use debouncedSearchTerm
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = debouncedSearchTerm.toLowerCase();

    // Handle empty search term case (return all transactions if search is empty)
    if (!searchTerm) {
      return true;
    }

    // Convert fields to lowercase for case-insensitive search
    const sender = transaction.sender?.toLowerCase() || ""; // Handle undefined sender
    const action = transaction.action?.toLowerCase() || "";
    const status = transaction.success ? "success" : "failed"; // Success/failed status

    // Check if any field contains the search term
    return (
      sender.includes(searchLower) ||
      action.includes(searchLower) ||
      status.includes(searchLower)
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
          onChange={handleSearchChange}
          value={searchTerm} // Controlled input
        />
      </div>

      <div
        className="overflow-x-auto"
        style={{ overflowY: "scroll", height: "800px" }}
      >
        <table className="table w-full">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr className="bg-gray-800 text-primary">
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2 hidden md:table-cell">Sender</th>
              <th className="px-4 py-2 hidden md:table-cell">Txn Hash</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr
                key={index}
                ref={
                  index === filteredTransactions.length - 1
                    ? lastTransactionElementRef
                    : null
                }
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="px-4 py-2">{transaction.action}</td>
                <td className="px-4 py-2">
                  {formatDate(transaction.transaction_timestamp)}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={
                      transaction.action === "Sent"
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {transaction.action === "Sent" ? "- " : "+ "}
                    {convertOctaToApt(transaction.amount)} APT
                  </span>
                </td>
                <td className="px-4 py-2 hidden md:table-cell truncate max-w-[150px]">
                  {collapseAddress(transaction.sender || "") || "N/A"}
                </td>
                <td className="px-4 py-2 hidden md:table-cell">
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${transaction.version}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {transaction.version}
                  </a>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.success
                        ? "bg-green-800 text-green-200"
                        : "bg-red-800 text-red-200"
                    }`}
                  >
                    {transaction.success ? "Success" : "Failed"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Info className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading && !hasMore && (
          <div className="text-center py-4 text-gray-500">
            No more transactions to load
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-4 mb-10">
        {/* <button className="btn btn-primary">New Transaction</button> */}
        {/* <button className="btn btn-outline">Export</button> */}
      </div>
    </main>
  );
};

export default TransactionTable;
