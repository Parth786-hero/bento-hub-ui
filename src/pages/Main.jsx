  import { Routes, Route } from "react-router-dom";
  import Navbar from "../components/Navbar";
  import Special from "../components/main/Special";
  import Category from "../components/main/Category";
  import Footer from "../components/Footer";
  import Products from "../components/main/Products";
  import SearchProducts from "../components/SearchProducts";
  import SpecificItem from "../components/main/SpecificItem";
  import Design from "../components/main/Design";
  import ProductsOnScroll from "../components/main/ProductsOnScroll";
  import AllItemsPerCategory from "../components/main/AllItemsPerCategory";
  import AdvanceSearch from "../components/main/AdvanceSearch/index.jsx";
  import MyOrders from "../components/main/customers/MyOrders";
  import { useEffect, useState } from "react";
  import { useLocation } from "react-router-dom";
  import { useSelector, useDispatch } from "react-redux";
  import {
    setDiscountStatus,
    endDiscount,
  } from "../store/slices/discountScheduler";
  import { ChevronRight } from "lucide-react";
  import confetti from "canvas-confetti";
  import io from "socket.io-client";
  import { API_URL } from "../config";
  import { motion } from "framer-motion";
  import { useCartContext } from "../hooks/useCart";


  import CartBanner from "../components/main/CartBanner";
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const Badge = ({ remainingSeconds }) => {
    // Example: when timer hits 0, trigger exit
    const isExpired = remainingSeconds <= 0;

    return (
      <div className="fixed bottom-2 md:bottom-6 right-3 md:right-8 flex flex-col items-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 3, x: 200, y: -200 }} // dramatic entrance
          animate={
            isExpired
              ? { opacity: 0, scale: 0.2, y: 100 } // shrink + fade away
              : { opacity: 1, scale: 1, x: 0, y: 0 } // normal state
          }
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          className="relative w-32 h-22 rounded-xl flex flex-col items-center justify-center 
                    bg-gradient-to-tr from-gray-900 via-purple-800 to-pink-600 
                    shadow-[0_0_30px_rgba(255,0,150,0.4)] overflow-hidden py-1"
        >
          {/* Sliding holographic panel */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />

          {/* Discount text */}
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 250 }}
            className="text-lg font-extrabold text-yellow-300 drop-shadow-[0_0_15px_rgba(255,200,0,0.9)]"
          >
            50% OFF
          </motion.p>

          {/* Countdown timer with flip effect */}
          <motion.span
            key={remainingSeconds}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          >
            {formatTime(remainingSeconds)}
          </motion.span>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] text-gray-200"
          >
            Limited Time!
          </motion.p>
        </motion.div>
      </div>
    );
  };




  const socket = io(API_URL);

  export default function Main() {
    const { pathname } = useLocation();
    const { show } = useSelector((bag) => bag.hitDiscount);
    const dispatch = useDispatch();
    const { getBag } = useCartContext();
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const { products } = useSelector((bag) => bag.products);
    // countdown ticking
    
    
    useEffect(() => {
      if (!show) return;
      const interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [show]);
    

    // listen for socket events
    useEffect(() => {
      socket.on("discountStatus", (data) => {
        if (data.active) {
          const elapsed = (Date.now() - data.startedAt) / 1000;
          const remaining = data.durationMinutes * 60 - elapsed;
          if (remaining > 0) {
            setRemainingSeconds(Math.floor(remaining));
            dispatch(setDiscountStatus(data));
            localStorage.setItem("discount", JSON.stringify(data));
          }
        } else {
          setRemainingSeconds(0);
          dispatch(endDiscount());
          localStorage.removeItem("discount");
        }
      });
      return () => socket.off("discountStatus");
    }, [dispatch]);

    // rehydrate on refresh
    useEffect(() => {
      const saved = localStorage.getItem("discount");
      if (saved) {
        const { startedAt, durationMinutes, percentage } = JSON.parse(saved);
        const elapsed = (Date.now() - startedAt) / 1000;
        const remaining = durationMinutes * 60 - elapsed;
        if (remaining > 0) {
          setRemainingSeconds(Math.floor(remaining));
          dispatch(
            setDiscountStatus({
              active: true,
              percentage,
              durationMinutes,
              startedAt,
            })
          );
        } else {
          localStorage.removeItem("discount");
          dispatch(endDiscount());
        }
      }
    }, [dispatch]);

    useEffect(() => {
      if (pathname === "/") {
        window.scrollTo(0, 0);
      }
    }, [pathname]);

    useEffect(() => {
      if (show) {
        confetti({
          particleCount: 1500,
          spread: 360,
          origin: { y: 0.7 },
        });
      }
    }, [show]);
    

    return (
      <>
        <div className="max-w-[95%] mx-auto min-h-screen hide-scrollbar">
         
         {show && <Badge remainingSeconds={remainingSeconds} />}
          {getBag().length > 0 && (
            <CartBanner show={true} getBag={getBag} remainingSeconds={remainingSeconds}/>
          )}
         

          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <div className="overflow-hidden">
                  <Special />
                  <Category />
                  <Products />
                </div>
              }
            />
            <Route path="/s" element={<SearchProducts />} />
            <Route path="/advanceSearch" element={<AdvanceSearch />} />
            <Route path="/productsOnScroll" element={<ProductsOnScroll />} />
            <Route path="/:category/:id" element={<SpecificItem />} />
            <Route path="/:name/:id/:name" element={<Design />} />
            <Route
              path="/itemspercategory/:id"
              element={<AllItemsPerCategory />}
            />
            <Route path="/my-orders" element={<MyOrders />} />
          </Routes>
          <br />
          <Footer />
        </div>
      </>
    );
  }
