import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./shared/header";
import { Provider } from "react-redux";
import getStore from "./shared/store";
import Footer from "./shared/footer";

export default function App() {
  return (
    <Provider store={getStore()}>
      <BrowserRouter>
        <Header />
        <div className="bg-gray-300 p-5 h-screen">
          <AppRoutes />
        </div>
        <Footer/>
      </BrowserRouter>
    </Provider>
  );
}
