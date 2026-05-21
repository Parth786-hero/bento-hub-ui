import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "../../../hooks/useCart";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import MiniCard from "./MiniCard";
import confetti from "canvas-confetti";
import Bill from "./Bill";
import { fetchAllProducts } from "../../../store/slices/productSlice";
import {
  calculateTotalPrice,
  calculateGrandTotal,
} from "../../../utilis/priceUtils";
import { API_URL } from "../../../main";
import { changeCartStatus } from "../../../store/slices/cartSlice";
import SuccessBanner from "./SuccessBanner";
export default function BottomSheet({ isOpen, donation, setDonation }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { getBag, clearTheCart, fetchCart } = useCartContext();
  const { products } = useSelector((bag) => bag.products);
  const { user } = useSelector((bag) => bag.login);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timerId, setTimer] = useState(null);

  const listOfAllProducts = useMemo(() => {
    return products.flatMap((obj) => obj.products);
  }, [products]);

  const cartItems = getBag();

  const totalPrice = useMemo(
    () => calculateTotalPrice(cartItems, listOfAllProducts),
    [cartItems, listOfAllProducts]
  );
  const basePrice = totalPrice + (donation ? 1 : 0);
  const grandTotal = calculateGrandTotal(basePrice);

  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  function cleanupAfterCheckout() {
    clearTheCart();
    localStorage.removeItem("cart");
    setDonation(false);
    localStorage.removeItem("donation");
    dispatch(fetchAllProducts());
    fetchCart();
    setSuccess(false);
    dispatch(changeCartStatus(false));
  }

  async function handleCheckout() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`, // send token in Authorization header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: user.cartId,
          status: "completed",
          donation: donation,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 550, spread: 200, origin: { y: 0.6 } });
        setSuccess(true);
        const timerId = setTimeout(() => {
          cleanupAfterCheckout();
        }, 12000);

        setTimer(timerId);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 z-30 w-screen h-screen"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onClick={() => dispatch(changeCartStatus(false))}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Side sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-blue-50 fixed overflow-hidden top-0 right-0 h-full shadow-xl z-40 w-full md:w-[30%] flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white-pure px-5 pt-5">
              <div className="flex justify-between items-center pb-2">
                <h2 className="text-xl font-extrabold">My Cart</h2>
                <button
                  onClick={() => dispatch(changeCartStatus(false))}
                  className="text-gray-600 hover:text-black font-extrabold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-3 z-410">
              <ul className="rounded-2xl p-3 bg-white-pure shadow-xl my-3">
                <div className="flex items-center gap-3 pb-3">
                  <i className="fa-solid fa-alarm-clock text-[1.6rem] text-green"></i>
                  <div>
                    <h2 className="font-extrabold tracking-wide">
                      {`${
                        totalPrice < 100 ? "" : "Free"
                      } Delivery in 10 minutes`}
                    </h2>
                    <p className="text-[12px] text-gray-600 tracking-wide">
                      Shipment of{" "}
                      {cartItems.reduce((a, b) => {
                        return a + b.count;
                      }, 0)}{" "}
                      items
                    </p>
                  </div>
                </div>
                {cartItems.map((item) => {
                  const product = listOfAllProducts.find(
                    (p) => p.id === item.id
                  );
                  return (
                    product && <MiniCard key={product.id} data={product} />
                  );
                })}
              </ul>
              <Bill
                price={totalPrice}
                donation={donation}
                setDonation={setDonation}
              />
            </div>

            {/* Checkout bar */}
            <div className="flex items-center justify-between font-bold h-[6rem] bg-green text-white px-5 rounded-t-2xl">
              <div className="flex flex-col items-start justify-start">
                <p className="font-extrabold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(grandTotal)}
                </p>
                <p className="font-normal text-[12px] tracking-wider">Total</p>
              </div>
              {/* {!loading ? (
                <p className="border-2 border-green px-5 py-2 rounded-xl shadow-2xl">
                  Placing order...
                </p>
              ) : error ? (
                <p className="text-red-500 font-bold text-[14px] border-1 px-5 py-2 rounded-xl">
                  {error}
                </p>
              ) : (
                <p
                  onClick={handleCheckout}
                  className="font-bold tracking-wider cursor-pointer border-2 border-green px-5 py-2 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Place Order
                </p>
              )} */}
              {loading ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 border-2 border-green 
               bg-green text-white px-5 py-2 rounded-full shadow-lg 
               font-semibold cursor-not-allowed"
                >
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Placing order...
                </button>
              ) : error ? (
                <button
                  disabled
                  className="text-red-600 font-bold text-sm border border-red-400 
               bg-red-50 px-5 py-2 rounded-full shadow-sm cursor-not-allowed"
                >
                  {error}
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="font-bold tracking-wide border-2 border-green bg-green 
               text-white px-5 py-2 rounded-full shadow-md 
               transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                >
                  Place Order
                </button>
              )}
            </div>
          </motion.div>

          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <SuccessBanner
                cleanupAfterCheckout={cleanupAfterCheckout}
                timerId={timerId}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
