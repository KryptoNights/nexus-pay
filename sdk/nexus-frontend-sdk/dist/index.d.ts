import React from 'react';

interface RequestIframeProps {
    name: string;
    details: string;
    amount: string;
    token: string;
    recipient_wallet: string;
    onClose: () => void;
    open: Boolean;
    onClick: () => void;
}

type RequiredRequestIframeProps = Required<RequestIframeProps>;
declare const NexusPay: React.FC<RequiredRequestIframeProps>;

export { NexusPay as default };
