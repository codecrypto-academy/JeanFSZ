import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressVerifier from "@/components/ui/address-verifier";
import { RootState } from "@/shared/store";
import { getBalance } from "@/shared/reducer/authentication.reducer";

const Balance = () => {
  const dispatch = useDispatch();
  const { account, balance, loading } = useSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (account) {
      dispatch(getBalance(account)); // Obtener el balance cuando la cuenta está disponible
    }
  }, [dispatch, account]);

  return (
    <div className="bg-white/75 dark:bg-gray-900 space-y-4 w-1/2 mx-auto rounded-lg shadow-lg p-6">
      <div className="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
        Your Balance: {loading ? "Loading..." : `${balance} ETH`}
      </div>
      <div className="mt-8">
        <AddressVerifier />
      </div>
    </div>
  );
};

export default Balance;
