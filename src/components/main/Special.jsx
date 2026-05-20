import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
// import { setShowWelcomes } from "../store/slices/loginSlice"; // adjust import path
import { setShowWelcomes } from "../../store/slices/loginSlice";
import { useNavigate } from "react-router-dom";
export default function Special() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, showWelcome } = useSelector((bag) => bag.login);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        // hide after 2s and mark as shown
        dispatch(setShowWelcomes(false));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, dispatch]);

  return (
    <div className="mt-[11rem] md:mt-[7.3rem] h-auto md:h-[20rem] rounded-2xl relative overflow-hidden div-bg p-4 md:px-8 md:py-6">
      {/* Welcome Back message inside parent */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-3 right-2 bg-white text-black rounded-sm px-4 py-1 text-sm tracking-wider shadow-md z-20"
          >
            Lets start shopping, <span className="font-bold">{user?.fname}</span>.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <h1 className="relative z-10 text-white text-3xl md:text-5xl w-auto md:w-[65%] md:tracking-wide md:leading-snug font-extrabold">
        Stock Up daily <span className="text-green">Essentials</span>.
      </h1>
      <p className="text-xl md:text-3xl text-white w-auto md:w-[60%] mt-3 md:leading-snug tracking-wide">
        Get Farm Fresh <span className="text-green">goodness</span> and a{" "}
        <span className="text-green">range of exotic</span> fruits, vegetables,
        eggs and more. <span className="text-green">Explore</span> more on our
        store. All authentic brands here.
      </p>
      <motion.button
        className="btn-white px-6 py-2 rounded-md font-black tracking-wide shadow-md mt-3 md:mt-7"
        whileHover={{
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.4 },
        }}
        whileTap={{
          scale: 0.95,
          x: [0, -11, 11, -11, 11, 0],
          transition: { duration: 0.3 },
        }}
        onClick={()=>navigate("/productsOnScroll")}
      >
        Shop Now
      </motion.button>
    </div>
  );
}
