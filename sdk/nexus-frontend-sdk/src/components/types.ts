export interface RequestIframeProps {
    name: string;
    details: string;
    amount: string;
    onClose: () => void;
    open: Boolean;
    onClick: () => void;
}
