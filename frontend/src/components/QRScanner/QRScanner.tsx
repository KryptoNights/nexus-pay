import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import styles from "./QRScanner.module.css";
import { isValidCustomText, isValidWalletAddress } from "@/core/utils";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";

const QRScanner = ({ setRecipientAddress, handlePopupClose }: any) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const video = videoElementRef.current;

    if (video) {
      const qrScanner = new QrScanner(
        video,
        (result) => {
          const scannedResult = result.data.trim();
          const parsedUrl = new URL(scannedResult);
          router.push(parsedUrl);

          const params = new URLSearchParams(parsedUrl.search);

          const address = params.get("address");
          const amount = params.get("amount");

          if (scannedResult) {
            mixpanel.track("scanner_succesfully");
            setRecipientAddress(address);
            handlePopupClose();
          } else {
            console.error("Invalid QR code scanned");
            setError("Please scan a valid QR code");
            mixpanel.track("invalid_qr_scanned");
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start();

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, []);

  return (
    <div>
      <div className={styles.videoWrapper}>
        <video className={styles.qrVideo} ref={videoElementRef} />
      </div>
      {error ?? <p className={styles.scannedText}>Error: {error}</p>}
    </div>
  );
};

export default QRScanner;
