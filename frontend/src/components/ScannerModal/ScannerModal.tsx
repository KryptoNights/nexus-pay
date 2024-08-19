import QRScanner from "../QRScanner/QRScanner";

const ScannerModal = ({
  onClose,
  setRecipientAddress,
  handlePopupClose,
}: {
  onClose: () => void;
  setRecipientAddress: any;
  handlePopupClose: any;
}) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      id="modal"
      className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="modal-box bg-gray-800 text-white max-w-sm relative">
        <button
          id="closeBtn"
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <div className="">
            <QRScanner
              setRecipientAddress={setRecipientAddress}
              handlePopupClose={handlePopupClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;
