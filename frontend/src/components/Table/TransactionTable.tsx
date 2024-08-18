import React from "react";

const TransactionTable = () => {
  return (
    <div className="container mx-auto p-2 dark:text-gray-800 sm:p-4">
      <h2 className="my-10 text-6xl font-bold text-secondary">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <colgroup>
            <col />
            <col />
            <col />
            <col />

            <col className="w-24" />
          </colgroup>
          <thead className="dark:bg-gray-300">
            <tr className="text-left">
              <th className="p-3">Transaction ID #</th>
              <th className="p-3">Address</th>

              <th className="p-3">Date</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
              <td className="p-3">
                <p>97412378923</p>
              </td>
              <td className="p-3">
                <p>Microsoft Corporation</p>
              </td>
              <td className="p-3">
                <p>14 Jan 2022</p>
                <p className="dark:text-gray-600">Friday</p>
              </td>

              <td className="p-3 text-right">
                <p>$15,792</p>
              </td>
              <td className="p-3 text-right">
                <span className="rounded-md px-3 py-1 font-semibold dark:bg-violet-600 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
            </tr>
            <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
              <td className="p-3">
                <p>97412378923</p>
              </td>
              <td className="p-3">
                <p>Tesla Inc.</p>
              </td>

              <td className="p-3">
                <p>01 Feb 2022</p>
                <p className="dark:text-gray-600">Tuesday</p>
              </td>
              <td className="p-3 text-right">
                <p>$275</p>
              </td>
              <td className="p-3 text-right">
                <span className="rounded-md px-3 py-1 font-semibold dark:bg-violet-600 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
            </tr>
            <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
              <td className="p-3">
                <p>97412378923</p>
              </td>
              <td className="p-3">
                <p>Coca Cola co.</p>
              </td>
              <td className="p-3">
                <p>14 Jan 2022</p>
                <p className="dark:text-gray-600">Friday</p>
              </td>

              <td className="p-3 text-right">
                <p>$8,950,500</p>
              </td>
              <td className="p-3 text-right">
                <span className="rounded-md px-3 py-1 font-semibold dark:bg-violet-600 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
            </tr>
            <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
              <td className="p-3">
                <p>97412378923</p>
              </td>
              <td className="p-3">
                <p>Nvidia Corporation</p>
              </td>
              <td className="p-3">
                <p>14 Jan 2022</p>
                <p className="dark:text-gray-600">Friday</p>
              </td>

              <td className="p-3 text-right">
                <p>$98,218</p>
              </td>
              <td className="p-3 text-right">
                <span className="rounded-md px-3 py-1 font-semibold dark:bg-violet-600 dark:text-gray-50">
                  <span>Pending</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
