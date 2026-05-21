import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { changeModalStatus } from "../store/slices/modalSlice";
// import { logout } from "../store/slices/loginSlice";
import UserAccount from "./main/UserAccount";
import { useNavigate, useLocation } from "react-router-dom";
import CartButton from "./main/CartButton";
import { useState } from "react";
// import Address from "./Address";
import UserAddress from "./main/UserAddress";
import { useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((bag) => bag.login);
  const [show, setShow] = useState(true);
  const items = ["Paneer", "Milk", "Bread", "Eggs", "Rice", "Oil", "Sugar"];
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (location.pathname === "/s") {
      setShow(false); // hide on /s
    } else {
      setShow(true); // show everywhere else
    }
  }, [location]);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2000); // change every 2 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {show && (
        <div className="fixed w-full top-0 left-0 z-50 bg-gray-100 px-1.5 md:px-0">
          {/* promo code  */}
          <AnimatePresence>
            {isAuthenticated && isVisible && (
              <motion.div
                initial={{ y: -100, opacity: 0, height: 0 }}
                animate={{ y: 0, opacity: 1, height: "6rem" }}
                exit={{ y: -100, opacity: 0, height: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="overflow-hidden flex flex-col items-center justify-center w-screen relative left-1/2 -translate-x-1/2 text-center shadow-md"
                style={{
                  background:
                    "linear-gradient(to right, #fef9c3, #fde68a, #fef9c3)",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 85%, 97% 100%, 94% 85%, 91% 100%, 88% 85%, 85% 100%, 82% 85%, 79% 100%, 76% 85%, 73% 100%, 70% 85%, 67% 100%, 64% 85%, 61% 100%, 58% 85%, 55% 100%, 52% 85%, 49% 100%, 46% 85%, 43% 100%, 40% 85%, 37% 100%, 34% 85%, 31% 100%, 28% 85%, 25% 100%, 22% 85%, 19% 100%, 16% 85%, 13% 100%, 10% 85%, 7% 100%, 4% 85%, 0 100%)",
                }}
              >
                <p className="w-fit font-semibold tracking-wide text-lg text-gray-700">
                  🚚 Free delivery on order above{" "}
                  <span className="text-green-600">Rs.100</span>
                </p>
                <p className="w-fit text-sm font-medium text-gray-800 tracking-wide animate-pulse">
                  🛒 Shop more, save more — happiness delivered!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <nav className="w-[95%] mx-auto py-5">
            {/* Mobile layout (smaller than md) */}
            <div className="flex flex-col gap-4 md:hidden">
              {/* Top row: logo left, login right */}
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-0.5">
                  {isAuthenticated && (
                    <section className="md:hidden flex items-center gap-x-8">
                      <UserAccount />
                      {/* <CartButton /> */}
                    </section>
                  )}
                  <h2
                    className="font-black tracking-wide text-2xl flex items-center cursor-pointer"
                    id="logo"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate("/");
                    }}
                  >
                    {isAuthenticated ? (
                      <span className="hidden md:inline">
                        <i className="fa-solid fa-blog"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fa-solid fa-blog"></i>
                      </span>
                    )}
                    Bento <span className="text-green">Hub</span>
                  </h2>
                </div>
                {isAuthenticated && (
                  <section className="md:hidden flex items-center gap-x-8 mr-0 w-stretch self-1">
                    {/* <UserAccount />
                    <CartButton /> */}
                    <div  className="w-screen h-screen absolute">
                    <CartButton />
                    </div>
 
                    <UserAddress user={user}/>
                  </section>
                )}

                {!isAuthenticated && (
                  <motion.button
                    className="btn px-4 py-2 rounded-md font-semibold tracking-wide shadow-md"
                    onClick={() =>
                      dispatch(
                        changeModalStatus({ show: true, mode: "LOG_IN" })
                      )
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log in
                  </motion.button>
                )}
              </div>

              <p
                className="border flex items-center justify-start rounded-md px-4 py-[.5rem] border-green text-gray-600 cursor-pointer w-full overflow-hidden"
                onClick={() => {
                  isAuthenticated
                    ? navigate("/s")
                    : dispatch(
                        changeModalStatus({ show: true, mode: "LOG_IN" })
                      );
                }}
              >
                Search{" "}
                <span
                  key={index}
                  className="tracking-wider mt-[1.02px] font-bold text-gray-600 inline-block ml-[5px] md:ml-[1px] animate-slide"
                >
                  "{items[index]}"
                </span>{" "}
              </p>
            </div>

            {/* Existing layout for md and larger screens */}
            <div className="hidden md:flex flex-col md:flex-row items-center justify-between">
              <h2
                className="font-black tracking-wide text-2xl flex items-center justify-between cursor-pointer"
                id="logo"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/");
                }}
              >
                <span>
                  <i className="fa-solid fa-blog"></i>
                </span>
                Bento <span className="text-green">Hub</span>
              </h2>

              {isAuthenticated && (
                <UserAddress user={user}/>
              )}

              <p
                className={`border overflow-hidden rounded-md px-4 py-[.5rem] border-green text-gray-600 cursor-pointer`}
                style={{ width: isAuthenticated ? "40%" : "60%" }}
                onClick={() => {
                  isAuthenticated
                    ? navigate("/s")
                    : dispatch(
                        changeModalStatus({ show: true, mode: "LOG_IN" })
                      );
                }}
              >
                {/* Search items here... */}
                Search{" "}
                <span
                  key={index}
                  className="tracking-wider mt-[1.02px] font-bold text-gray-600 inline-block ml-[5px] md:ml-[1px] animate-slide"
                >
                  "{items[index]}"
                </span>{" "}
              </p>

              {isAuthenticated ? (
                <section className="flex items-center gap-x-8">
                  <UserAccount />
                  <CartButton />
                </section>
              ) : (
                <section className="flex items-center gap-x-8">
                  {/* Sign up only visible on md+ */}
                  <motion.button
                    className="hidden md:flex font-bold tracking-wide cursor-pointer"
                    onClick={() =>
                      dispatch(
                        changeModalStatus({ show: true, mode: "REGISTER" })
                      )
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign up
                  </motion.button>
                  <motion.button
                    className="btn px-6 py-2 rounded-md font-semibold tracking-wide shadow-md"
                    onClick={() =>
                      dispatch(
                        changeModalStatus({ show: true, mode: "LOG_IN" })
                      )
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log in
                  </motion.button>
                </section>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
