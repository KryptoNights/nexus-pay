import React from 'react';

interface RequestIframeProps {
    name: string;
    details: string;
    amount: string;
}

declare const NexusPay: React.FC<RequestIframeProps>;

export { NexusPay as default };
