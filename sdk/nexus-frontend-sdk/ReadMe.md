# Nexus Pay

**Nexus Pay** is a seamless crypto payment platform that allows users to send and receive payments using QR codes and Nexus IDs. Designed for both P2P and merchant transactions, NexusPay simplifies the payment experience.

## Features

- **Add Money**: Easily add funds from your bank account or an external crypto wallet.
- **Pay Anywhere**: Scan to pay at any merchant that accepts Nexus Pay, or search and pay people using their Nexus IDs.
- **Dollar Transactions**: All your transactions are in dollars. We take care of the blockchain conversion in the background.
- **Withdraw Anytime**: Withdraw your money back to your bank account whenever you want.
- **Universal Access**: Your Nexus Pay wallet is created using your Google login and can be accessed from any device, anywhere in the world.
- **Merchant Tools**: We aim to develop a suite of tools for merchants, including detailed transaction reports, easy integration with existing POS systems, and promotional tools to engage customers.

## Getting Started

1. **Create Your Wallet**: Sign up with your Google account directly from your browser. Your wallet will be created instantly.
2. **Add Funds**: Link your bank account or external wallet to add money to Nexus Pay.
3. **Start Paying**: Use your Nexus ID or scan QR codes to pay at merchants or send money to friends.
4. **Withdraw Funds**: Need your money back in your bank? No problem, you can withdraw it anytime.

Sign in with Google and bring your own money. Pay anyone, anywhere from any device. One wallet, all of the world.

# How to Integrate SDK for Nexus Pay

The NexusPay SDK provides a customizable payment component for integrating Nexus Pay functionality into your application.

1. **Install SDK**:

```
npm i nexus-frontend-sdk
```

2. **Import SDK component in Your Frontend**:

```
import NexusPay from "nexus-frontend-sdk";
```

3. **Use the component in Frontend to Request Payment**:

```
const index = () => {
  const [handleOpen, setHandleOpen] = useState(false);
  return (
      <NexusPay
        name="Nexus Pay "
        details="Sample request "
        amount="10"
        open={handleOpen}
        token="USD"
        onClick={() => setHandleOpen(true)}
        onClose={() => setHandleOpen(!handleOpen)}
        recipient_wallet= "0xede634cb984f2897df0d3630257d3707202f85187ae9c8e51bcef102235981d0"
      />
  );
};

export default index;


```

## Props

| Prop      | Type     | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `name`    | string   | The name or title of the payment component.                |
| `details` | string   | A brief description or details about the payment.          |
| `amount`  | string   | The payment amount.                                        |
| `open`    | boolean  | Controls the visibility of the payment component.          |
| `token`    | string  | Can accept USD or APT as input and user can pay that token.|
| `onClick` | function | Callback function triggered when the component is clicked. |
| `onClose` | function | Callback function triggered when the component is closed.  |
| `recipient_wallet` | string | Nexus wallet address to whom payment will go to.    |

### name

- Type: `string`
- Required: Yes
- Description: Specifies the name or title of the payment component. This is typically displayed prominently in the UI.

### details

- Type: `string`
- Required: Yes
- Description: Provides additional information or a description of the payment. This helps users understand the purpose or context of the transaction.

### amount

- Type: `string`
- Required: Yes
- Description: Specifies the payment amount. Note that this is passed as a string, so be sure to format it appropriately.

### open

- Type: `boolean`
- Required: Yes
- Description: Controls the visibility of the NexusPay component. Set to `true` to show the component, `false` to hide it.

### token

- Type: `string`
- Required: Yes
- Description:  Can accept USD or APT as input and user can pay that token.

### onClick

- Type: `function`
- Required: Yes
- Description: A callback function that is triggered when the component is clicked. Typically used to open or activate the payment interface.

### onClose

- Type: `function`
- Required: Yes
- Description: A callback function that is called when the component is closed. Use this to handle any cleanup or state updates when the payment interface is dismissed.

### recipient_wallet

- Type: `string`
- Required: Yes
- Description: Specifies whose nexus account will be credited the money.

## Example

```
const index = () => {
  const [handleOpen, setHandleOpen] = useState(false);
  return (
      <NexusPay
        name="Nexus Pay "
        details="Sample request "
        amount="10"
        open={handleOpen}
        token="USD"
        onClick={() => setHandleOpen(true)}
        onClose={() => setHandleOpen(!handleOpen)}
        recipient_wallet= "0xede634cb984f2897df0d3630257d3707202f85187ae9c8e51bcef102235981d0"
      />
  );
};

export default index;


```
