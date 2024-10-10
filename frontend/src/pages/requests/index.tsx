import Layout from "@/components/Layout/Layout";
import { sendStableMoneyFunc } from "@/utils/apis";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Define the Approval type
interface Approval {
  id: string;
  name: string;
  amount: number;
  details: string;
  is_filled: boolean;
  txn_hash: string;
}

const Index = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );
  const emailId = idToken?.state?.accounts?.[0]?.idToken?.decoded?.email;

  useEffect(() => {
    const fetchApprovals = async () => {
      const response = await fetch(
        "https://nexus-fetch-approval-requests-876401151866.us-central1.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 12345",
          },
          body: JSON.stringify({ email: emailId }),
        }
      );
      const data = await response.json();
      setApprovals(data.approvals);
      setLoading(false);
    };

    fetchApprovals();
  }, []);

  const handleApprove = async (
    id: string,
    recipientAddress: any,
    transferAmount: any,
    activeAccountAdress: any
  ) => {
    try {
      setPaymentsLoading(true);
      const res = await sendStableMoneyFunc(
        recipientAddress,
        transferAmount,
        activeAccountAdress
      );
      console.log("payment status", res);
      // Implement the API call to update the approval status
      setPaymentsLoading(false);
    } catch (error) {
      console.log(error);
    }
    console.log(`Approved: ${id}`);
  };

  const handleReject = async (id: string) => {
    // Implement the rejection logic here
    console.log(`Rejected: ${id}`);
  };

  const getStatusInfo = (approval: Approval) => {
    if (approval.is_filled) {
      return {
        status: "Filled",
        message:
          approval.txn_hash === "0x00000000test000000000test0000000000test"
            ? "Rejected"
            : "Successful",
        className:
          approval.txn_hash === "0x00000000test000000000test0000000000test"
            ? "bg-error text-error-content"
            : "bg-success text-success-content",
        badgeClass: "badge-success",
      };
    } else if (approval.txn_hash) {
      return {
        status: "Rejected",
        message: `Rejected - Transaction Hash: ${approval.txn_hash}`,
        className: "bg-error text-error-content",
        badgeClass: "badge-error",
      };
    } else {
      return {
        status: "Pending",
        message: null,
        className: "",
        badgeClass: "badge-warning",
      };
    }
  };

  const renderApprovalCard = (approval: Approval) => {
    const { status, message, className, badgeClass } = getStatusInfo(approval);

    return (
      <div
        key={approval.id}
        className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="card-body flex-initial">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold">
              {approval.name}
            </h2>
            <span className={`badge ${badgeClass}`}>{status}</span>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-primary">
              ${approval.amount}
            </p>
            <p className="text-base-content/70 text-sm">{approval.details}</p>
          </div>
          {message && (
            <p className={`text-center font-bold p-2 rounded-md ${className}`}>
              {message}
            </p>
          )}
          {status === "Pending" && (
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-primary flex-1"
                onClick={() =>
                  handleApprove(
                    approval.id,
                    approval,
                    approval.amount,
                    activeAccountAdress
                  )
                }
                disabled={paymentsLoading}
              >
                {paymentsLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Approve"
                )}
              </button>
              <button
                className="btn btn-outline btn-error flex-1"
                onClick={() => handleReject(approval.id)}
                disabled={rejectLoading}
              >
                {rejectLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Requests | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Approval Requests
        </h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading requests...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-base-content/60 mt-8">
              No requests yet!
            </p>
            {/* <button className="btn btn-primary mt-4">Create a Request</button> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvals.map(renderApprovalCard)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
