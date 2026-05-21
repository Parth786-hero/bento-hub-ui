
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessBanner({ cleanupAfterCheckout, timerId }) {
    const navigate = useNavigate();
  
    const handleContinue = () => {
      if (timerId) clearTimeout(timerId); // cancel auto-dismiss
      cleanupAfterCheckout();             // run immediately
      navigate("/");                      // go home
    };
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 
                 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-500"
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white rounded-md p-2 md:p-6 w-[90%] md:w-auto relative"
      >
        <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute top-0 left-0 h-[6.5px] bg-green rounded-md"
          />
        {/* Success Tick with Glow Pulse */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0px rgba(34,197,94,0.6)",
              "0 0 20px rgba(34,197,94,0.8)",
              "0 0 0px rgba(34,197,94,0.6)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-20 h-20 bg-green rounded-full 
                     top-[-3rem] left-1/2 transform -translate-x-1/2 flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-white" strokeWidth={5} />
        </motion.div>

        {/* Title with Fade‑In */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 text-center font-black text-[1.6rem] tracking-wide text-gray-700"
        >
          Order Placed Successfully
        </motion.h3>

        {/* Rider Image with Float + Tilt */}
        <motion.img
          src="./rider.svg"
          alt="Rider"
          className="w-38 h-34 mx-auto object-contain"
          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <p className="w-[80%] mx-auto mb-4 text-gray-900 font-normal text-center text-sm">
          Hold back tight as we will assign rider once your order is packed.
        </p>

        <button
          className="w-full text-white bg-green rounded-md text-md tracking-wide font-semibold py-1 mb-1"
          onClick={handleContinue}
        >
          Continue Shopping
        </button>
      </motion.div>
    </motion.div>
  );
}

