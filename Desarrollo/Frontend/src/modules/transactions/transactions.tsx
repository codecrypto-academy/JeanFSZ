import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TransactionResponse } from "@/shared/interfaces/transaction-interface";
import Alert from "@/shared/alert";
import { ethers } from "ethers";
import { Provider } from "ethers";

const Transactions = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionResult, setTransactionResult] =
    useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendEther = async () => {
    setLoading(true);
    setError(null);
    setTransactionResult(null);

    try {
      const response = await axios.get<TransactionResponse>(
        `http://localhost:3333/api/faucet/${address}/${amount}`
      );
      setTransactionResult(response.data);
    } catch (err) {
      setError("Error sending Ether. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendEtherWithMetaMask = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      setError("MetaMask is not installed!");
      return;
    }

    // Prompt MetaMask for account access
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = provider.getSigner();

    await provider.send("eth_requestAccounts", []); // Solicitar cuentas de MetaMask


    try {
      // Request MetaMask to connect the wallet
      await provider.send("eth_requestAccounts", []);
      const from = await (await signer).getAddress();
      const tx = {
        to: address,
        value: ethers.parseEther(amount), // Convert amount to wei
      };

      setLoading(true);
      setError(null);

      // Send the transaction
      const transactionResponse = await (await signer).sendTransaction(tx);
      console.log("Transaction sent:", transactionResponse);
      await transactionResponse.wait(); // Wait for the transaction to be mined

      setTransactionResult({
        date: new Date(),
        from,
        to: address,
        txHash: transactionResponse.hash,
        newBalance: Number(await provider.getBalance(from)),
      });
    } catch (err) {
      setError("Error sending Ether with MetaMask.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/75 dark:bg-gray-900 space-y-4 w-1/2 mx-auto rounded-lg shadow-lg p-6">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter recipient address..."
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in ETH..."
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <Button
        onClick={sendEther}
        variant="default"
        size="default"
        disabled={loading || address === "" || amount === ""}
      >
        {loading ? "Sending..." : "Send Ether via API"}
      </Button>
      <Button
        onClick={sendEtherWithMetaMask}
        variant="default"
        size="default"
        disabled={loading || address === "" || amount === ""}
      >
        {loading ? "Sending..." : "Transfer by MetaMask"}
      </Button>

      {transactionResult && (
        <Alert type="success">
          <p className="text-green-500 text-sm font-medium">
            Transaction successful!
            <br />
            From: {transactionResult.from}
            <br />
            To: {transactionResult.to}
            <br />
            Transaction Hash: {transactionResult.txHash}
            <br />
            New Balance: {ethers.formatEther(transactionResult.newBalance)} ETH
          </p>
        </Alert>
      )}
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};

export default Transactions;
