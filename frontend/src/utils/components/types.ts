export interface RequestIframeProps {
    name: string;
    details: string;
    amount: string;
    buttonClassName?: string;
    onClose: () => void;
    open: Boolean;
    onClick: () => void;
}
