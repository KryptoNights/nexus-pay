import Layout from "@/components/Layout/Layout";
import { sendStablePayment } from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { sendStableMoneyFunc } from "@/utils/apis";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// Define the Approval type
interface Approval {
  id: string;
  name: string;
  amount: number;
  details: string;
  is_filled: boolean;
  tx_hash: string;
  recipient_wallet: string;
}

// Custom hook for fetching approvals
const useFetchApprovals = (emailId: string | undefined) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      if (!emailId) return;
      try {
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
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [emailId]);

  return { approvals, loading };
};

// Optimized getStatusInfo function
const getStatusInfo = (approval: Approval) => {
  const rejectTxHash = "0000";

  if (approval.is_filled) {
    const isRejected = approval.tx_hash === rejectTxHash;
    return {
      status: "Filled",
      message: isRejected ? "Rejected" : "Successful",
      className: isRejected
        ? "bg-error text-error-content"
        : "bg-success text-success-content",
      badgeClass: "badge-success",
    };
  }

  if (approval.tx_hash) {
    return {
      status: "Rejected",
      message: `Rejected - Transaction Hash: ${approval.tx_hash}`,
      className: "bg-error text-error-content",
      badgeClass: "badge-error",
    };
  }

  return {
    status: "Pending",
    message: null,
    className: "",
    badgeClass: "badge-warning",
  };
};

const Index = () => {
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { activeAccount } = useKeylessAccounts();
  const { idToken, activeAccountAdress } = useSelector(
    (state: { authSlice: { idToken: any; activeAccountAdress: string } }) =>
      state.authSlice
  );
  const emailId = idToken?.state?.accounts?.[0]?.idToken?.decoded?.email;

  const { approvals, loading } = useFetchApprovals(emailId);

  const handleApprove = useCallback(
    async (
      id: string,
      recipientAddress: string,
      transferAmount: number,
      activeAccountAdress: string
    ) => {
      try {
        setPaymentsLoading(true);

        const hash = await sendStablePayment(
          AccountAddress.fromString(recipientAddress),
          transferAmount,
          activeAccount!,
          false
        );
        console.log("payment status", hash);
        
        // Implement the API call to update the approval status
        const res = await fetch('https://nexus-fill-request-876401151866.us-central1.run.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 12345890'
          },
          // body: '{\n    "id": "y1YQGGQw6ydv",\n    "tx_hash": "0000",\n    "email": "debjitbhowal.db@gmail.com"\n}',
          body: JSON.stringify({
            'id': id,
            'tx_hash': hash,
            'email': 'debjitbhowal.db@gmail.com'
          })
        });
        console.log("API RESPONSE");
        console.log(res);
      } catch (error) {
        console.error(error);
      } finally {
        setPaymentsLoading(false);
      }
      console.log(`Approved: ${id}`);
    },
    []
  );

  const handleReject = useCallback(async (id: string) => {
    // Implement the rejection logic here
    console.log(`Rejected: ${id}`);
    const res = await fetch('https://nexus-fill-request-876401151866.us-central1.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 12345890'
      },
      // body: '{\n    "id": "y1YQGGQw6ydv",\n    "tx_hash": "0000",\n    "email": "debjitbhowal.db@gmail.com"\n}',
      body: JSON.stringify({
        'id': id,
        'tx_hash': "0000",
        'email': 'debjitbhowal.db@gmail.com'
      })
    });
    console.log("API RESPONSE");
    console.log(res);
  }, []);

  const renderApprovalCard = useCallback(
    (approval: Approval) => {
      const { status, message, className, badgeClass } =
        getStatusInfo(approval);

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
              <p
                className={`text-center font-bold p-2 rounded-md ${className}`}
              >
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
                      approval.recipient_wallet, // Assuming this is the recipient address
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
    },
    [
      handleApprove,
      handleReject,
      paymentsLoading,
      rejectLoading,
      activeAccountAdress,
    ]
  );

  const approvalCards = useMemo(
    () => approvals.map(renderApprovalCard),
    [approvals, renderApprovalCard]
  );

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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvalCards}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
