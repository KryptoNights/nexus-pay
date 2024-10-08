import Layout from "@/components/Layout/Layout";
import { sendStableMoneyFunc } from "@/utils/apis";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./index.module.css";

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

      // const response = await fetch(
      //   "https://nexus-fill-request-876401151866.us-central1.run.app",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer 12345",
      //     },
      //     body: JSON.stringify({
      //       id: id,
      //       tx_hash: "0x00000000test000000000test0000000000test",
      //       email: emailId,
      //     }),
      //   }
      // );
      setPaymentsLoading(false);
    } catch (error) {
      console.log(error);
    }
    console.log(`Approved: ${id}`);
  };

  const handleReject = async (id: string) => {
    console.log(`Rejected: ${id}`);
    setRejectLoading(true);
    const response = await fetch(
      "https://nexus-fill-request-876401151866.us-central1.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 12345",
        },
        body: JSON.stringify({
          id: id,
          tx_hash: "0x00000000test000000000test0000000000test",
          email: emailId,
        }),
      }
    );
    setRejectLoading(false);
  };

  const getStatusInfo = (approval: Approval) => {
    if (approval.is_filled) {
      return {
        status: "Filled",
        message:
          approval.txn_hash === "0x00000000test000000000test0000000000test"
            ? "Rejected"
            : "Successful",
        className: `${styles.statusMessage} ${approval.txn_hash === "0x00000000test000000000test0000000000test" ? styles.rejected : styles.successful}`,
      };
    } else if (approval.txn_hash) {
      return {
        status: "Rejected",
        message: `Rejected - Transaction Hash: ${approval.txn_hash}`,
        className: styles.rejected,
      };
    } else {
      return {
        status: "Pending",
        message: null,
        className: styles.pending,
      };
    }
  };

  const renderApprovalCard = (approval: Approval) => {
    const { status, message, className } = getStatusInfo(approval);

    return (
      <div key={approval.id} className={styles.approvalCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{approval.name}</h2>
          <span className={`${styles.statusBadge} ${className}`}>{status}</span>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.amount}>${approval.amount}</p>
          <p className={styles.details}>{approval.details}</p>
        </div>
        {message && <p className={className}>{message}</p>}
        {status === "Pending" && (
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.approveButton}`}
              onClick={() =>
                handleApprove(
                  approval.id,
                  approval!,
                  approval.amount,
                  activeAccountAdress
                )
              }
            >
              Approve
            </button>
            <button
              className={`${styles.button} ${styles.rejectButton}`}
              onClick={() => handleReject(approval.id)}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Requests | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Approval Requests</h1>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading requests...</p>
          </div>
        ) : approvals.length === 0 ? (
          <p className={styles.noRequests}>No requests yet!</p>
        ) : (
          <div className={styles.approvalGrid}>
            {approvals.map(renderApprovalCard)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
