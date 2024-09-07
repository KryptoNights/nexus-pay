import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { get_transaction_history } from "@/core/transactions";
import { convertOctaToApt } from "@/core/utils";

// Interface for the transaction history response
interface TransactionHistory {
  version: string; // Assuming 'version' is a date string or timestamp
  action: string;
  amount: number;
  gas_fee?: number;
  success: boolean;
  sender?: string;
}

// Interface for balance data
interface BalanceData {
  date: string;
  balance: number;
}

const CustomTooltip = ({ payload, label }: any) => {
  if (payload && payload.length) {
    return (
      <div className="custom-tooltip">
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
        console.log("response", response);

        // Set the transaction history
        setTransactions(response as TransactionHistory[]);

        // Calculate balance insights
        const balanceHistory = (response as TransactionHistory[]).reduce(
          (acc: BalanceData[], tx: TransactionHistory, index: number) => {
            const prevBalance = convertOctaToApt(acc[index - 1]?.balance) || 0;
            const newBalance = convertOctaToApt(prevBalance + tx.amount); // Update balance based on transaction amount
            acc.push({
              // Assuming 'version' can be treated as a timestamp or version identifier for simplicity
              date: "02/03", // Replace 'version' with actual date if available
              balance: newBalance,
            });
            return acc;
          },
          []
        ).reverse();;

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
        <LineChart
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
              value: "Balance",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ stroke: "#8884d8", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightsGraph;
