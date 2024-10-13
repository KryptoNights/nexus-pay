import { get_transaction_history } from "@/core/transactions";
import { convertOctaToApt, formatDate } from "@/core/utils";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./insights.module.css";

// Interface for the transaction history response
interface TransactionHistory {
  version: string; // Assuming 'version' is a date string or timestamp
  action: string;
  transaction_timestamp: string;
  amount: number;
  gas_fee?: number;
  success: boolean;
  sender?: string;
  asset_type?: string;
}

// Interface for balance data
interface BalanceData {
  date: string;
  usdt: number;
  apt: number;
}

const CustomTooltip = ({ payload, label }: any) => {
  if (payload && payload.length) {
    return (
      <div className="custom-tooltip transparent-tooltip">
        <p className="label">{`Date: ${label}`}</p>
        <p className="balance">{`Balance: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const InsightsGraph = ({
  activeAccountAdress,
}: {
  activeAccountAdress: string;
}) => {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData[]>([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const offset = 0;
        const response = await get_transaction_history(
          activeAccountAdress,
          offset
        );

        // Set the transaction history
        setTransactions(response as TransactionHistory[]);

        // Get today's date and filter for the last 7 days
        const today = new Date();
        const last7Days = new Date(today.setDate(today.getDate() - 7));

        // Calculate balance insights
        const balanceHistory = (response as TransactionHistory[])
          .filter((tx) => new Date(tx.transaction_timestamp) >= last7Days) // Filter for last 7 days
          .reduce((acc: BalanceData[], tx: TransactionHistory) => {
            const date = formatDate(tx.transaction_timestamp);
            const amount = tx.amount; // Convert amount to APT

            // Initialize entry if it doesn't exist
            const entry = acc.find((item) => item.date === date) || {
              date,
              usdt: 0,
              apt: 0,
            };

            // Aggregate amounts based on asset type
            if (tx?.asset_type?.includes("USDT")) {
              // Changed comparison to check for truthiness
              entry.usdt += amount / 1000000;
            } else {
              entry.apt += convertOctaToApt(amount);
            }

            // Update or add the entry
            if (!acc.find((item) => item.date === date)) {
              acc.push(entry);
            }
            return acc;
          }, [])
          .reverse();

        setBalanceData(balanceHistory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setLoading(false);
      }
    };

    if (activeAccountAdress) {
      fetchTransactionHistory();
    }
  }, [activeAccountAdress]);

  return (
    <div className="chart-container flex-grow px-4 text-center">
      <h1 className="mt-3 mb-8 text-4xl font-bold text-primary">
        Spend history
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={balanceData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8884d8" }}
            label={{ value: "Date", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            tick={{ fill: "#8884d8" }}
            label={{
              value: "Amount",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" />
          <Bar dataKey="usdt" fill="#82ca9d" name="USDT" />
          <Bar dataKey="apt" fill="#8884d8" name="APT" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightsGraph;
