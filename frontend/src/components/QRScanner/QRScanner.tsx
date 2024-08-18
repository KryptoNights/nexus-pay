import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import styles from "./QRScanner.module.css";

const QRScanner = ({ setRecipientAddress, handlePopupClose }: any) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoElementRef.current;

    if (video) {
      const qrScanner = new QrScanner(
        video,
        (result) => {
          handlePopupClose();
          setRecipientAddress(result.data);
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
      {/* <p className={styles.scannedText}>SCANNED: {scanned}</p> */}
    </div>
  );
};

export default QRScanner;
