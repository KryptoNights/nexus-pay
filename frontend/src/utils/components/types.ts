export interface RequestIframeProps {
    name: string;
    details: string;
    amount: string;
    token: string,
    recipient_wallet: string
    onClose: () => void;
    open: Boolean;
    onClick: () => void;
    buttonClassName?: string;
}
