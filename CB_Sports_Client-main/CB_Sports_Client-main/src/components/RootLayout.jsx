import Header from "./Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import "slick-carousel/slick/slick.css";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import MainLoader from "./MainLoader";
import ServicesTag from "./ServicesTag";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        {/* Premium Support Badge */}
        <div className="px-4 py-2 text-sm font-medium text-center text-white shadow-sm bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>📞 0909 123 456</span>
            <span>📍 TP Huế, Việt Nam</span>
            <a href="#">
              <span>✉️ support@yourshop.com</span>
            </a>
          </div>
        </div>

        <Header />
        <ScrollRestoration />
        <Outlet />
        <ServicesTag />
        <Footer />
        <ScrollToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
