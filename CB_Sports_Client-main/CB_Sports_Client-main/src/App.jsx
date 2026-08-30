import { useEffect, useCallback } from "react";
import Banner from "./components/Banner";
import Container from "./components/Container";
import BestSellers from "./components/homeProducts/BestSellers";
import NewArrivals from "./components/homeProducts/NewArrivals";
import ProductOfTheYear from "./components/homeProducts/ProductOfTheYear";
import SpecialOffers from "./components/homeProducts/SpecialOffers";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  addUser,
  removeUser,
  setOrderCount,
  resetOrderCount,
} from "./redux/orebiSlice";
import { config } from "../config";
const serverUrl = config.baseUrl;

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Function to fetch user orders and update count
  const fetchUserOrderCount = useCallback(
    async (token) => {
      try {
        const response = await fetch(`${serverUrl}/api/order/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          dispatch(setOrderCount(data.orders.length));
        } else {
          dispatch(resetOrderCount());
        }
      } catch (error) {
        console.error("Error fetching order count:", error);
        dispatch(resetOrderCount());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      let userData = null;
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }

      if (!userData) {
        try {
          userData = jwtDecode(token);
        } catch (e) {
          // If token is not JWT (e.g., Laravel Sanctum), create fallback user info
          userData = { name: "User", email: "user@cbsports.com" };
        }
      }

      if (userData) {
        dispatch(addUser(userData));
      }
      fetchUserOrderCount(token);
    } else {
      dispatch(removeUser());
      dispatch(resetOrderCount());
    }
  }, [token, dispatch, fetchUserOrderCount]);
  return (
    <main className="w-full overflow-hidden">
      <Banner />
      <Container className="py-5 md:py-10">
        <NewArrivals />
        <BestSellers />
        <ProductOfTheYear />
        <SpecialOffers />
      </Container>
    </main>
  );
}

export default App;
