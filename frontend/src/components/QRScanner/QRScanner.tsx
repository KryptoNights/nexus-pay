import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import styles from "./QRScanner.module.css";
import { isValidCustomText, isValidWalletAddress } from "@/core/utils";

const QRScanner = ({ setRecipientAddress, handlePopupClose }: any) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoElementRef.current;

    if (video) {
      const qrScanner = new QrScanner(
        video,
        (result) => {
          const scannedResult = result.data.trim();

          if (
            isValidWalletAddress(scannedResult) ||
            isValidCustomText(scannedResult)
          ) {
            setRecipientAddress(scannedResult);
            handlePopupClose();
          } else {
            console.error("Invalid QR code scanned");
            setError("Please scan a valid QR code");
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
        console.log(qrScanner);
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
