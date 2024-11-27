import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

const AddressVerifier = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener el balance de la dirección
  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      const response = await axios.post(
        "http://localhost:5556/",
        {
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extraer el balance de la respuesta y convertirlo a ETH
      if (response.data && response.data.result) {
        const weiBalance = parseInt(response.data.result, 16);
        const ethBalance = weiBalance / Math.pow(10, 18); // Convertir de Wei a ETH
        setBalance(ethBalance);
      } else {
        setError("Failed to retrieve balance.");
      }
    } catch (err) {
      setError("Error fetching balance. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Ethereum address..."
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <Button
        onClick={fetchBalance}
        variant="default"
        size="default"
        disabled={loading || address === ""}
      >
        {loading ? "Verifying..." : "Verify Address"}
      </Button>
      {balance !== null && (
        <p className="text-green-500 text-sm font-medium">
          Balance: {balance} ETH
        </p>
      )}
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};

export default AddressVerifier;
