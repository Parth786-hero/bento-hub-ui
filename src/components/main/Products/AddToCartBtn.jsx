import { useCartContext } from "../../../hooks/useCart";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkAuthority } from "../../../utilis/priceUtils";

export default function AddToCartBtn({ id }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { getItemsPerCard, addToCart, removeFromCart, error } = useCartContext();
  const nums = getItemsPerCard(id);
  const { products } = useSelector((bag) => bag.products);
  const allProducts = products.flatMap((ele) => ele.products);
  const stock = allProducts.find((ele) => ele.id === id)?.stock;
  const { user } = useSelector(bag => bag.login);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (stock === 0) {
    return (
      <button
        className="text-xs md:text-sm px-1.5 right-0.5 top-0.5 cursor-not-allowed absolute bg-gray-800 w-fit rounded-full text-center text-white tracking-wider flex items-center justify-center"
        disabled
        style={{padding : ".15rem .6rem"}}
      >
        out of stock
      </button>
    );
  }

  return (
    <AnimatePresence>
  {nums === 0 ? (
    isSmallScreen ? (
      // Plain button on small screens
      <button
        key="add"
        // disabled={error || checkAuthority(user.email)}
        className="product-btn font-semibold cursor-pointer absolute right-0.5 top-0.5 bg-green rounded-lg py-0.5 px-1.5"
        // onClick={(e) => {
        //   e.stopPropagation();
        //   addToCart(id);
        //   if (navigator.vibrate) {
        //     navigator.vibrate(100); // vibrates for 100ms
        //   }
        // }}
        onClick={(e) => {
          e.stopPropagation();
          addToCart(id);
        
          // Android vibration
          if (navigator.vibrate) {
            navigator.vibrate(100);
          } else {
            // iOS fallback: bounce animation
            const btn = e.currentTarget;
            btn.animate(
              [
                { transform: "scale(1)" },
                { transform: "scale(1.15)" },
                { transform: "scale(1)" }
              ],
              {
                duration: 200,
                easing: "ease-out"
              }
            );
          }
        }}
        
        // style={{ backgroundColor: error ? "gray" : "rgba(0, 128, 0, 0.04)" }}
        style={{ backgroundColor: error ? "gray" : "var(--color-green)" }}
      >
        {/* <Plus
         className="text-green" /> */}
         <span className="text-white font-bold tracking-wider text-sm" style={{fontWeight : 800}}>ADD</span>
      </button>
    ) : (
      // Animated button on larger screens
      <motion.button
        key="add"
        disabled={error || checkAuthority(user.email)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="product-btn font-semibold cursor-pointer absolute right-0.5 top-0.5 border border-green rounded-lg p-1"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(id);
        }}
        style={{ backgroundColor: error ? "gray" : "rgba(0, 128, 0, 0.05)" }}
      >
        <Plus className="text-green" />
      </motion.button>
    )
  ) : (
    isSmallScreen ? (
      // Plain counter on small screens
      <div
        key="counter"
        className="border-green border-1 adding-to-cart-btn font-semibold flex items-center justify-between gap-2 cursor-auto absolute top-0.5 right-0.5"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: error ? "gray" : "var(--color-green)" }}
      >
        <i
          className="fa-solid fa-minus inline-block cursor-pointer"
          onClick={() => removeFromCart(id)}
        ></i>
        <p className="font-extrabold text-[16px]">{nums}</p>
        <i
          className="fa-solid fa-plus inline-block cursor-pointer"
          onClick={() => addToCart(id)}
        ></i>
      </div>
    ) : (
      // Animated counter on larger screens
      <motion.div
        key="counter"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="border-green border-1 adding-to-cart-btn font-semibold flex items-center justify-between gap-2 cursor-auto absolute top-0.5 right-0.5"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: error ? "gray" : "var(--color-green)" }}
      >
        <motion.i
          whileTap={{ scale: 0.9 }}
          className="fa-solid fa-minus inline-block cursor-pointer"
          onClick={() => removeFromCart(id)}
        ></motion.i>
        <motion.p
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.15 }}
          className="font-extrabold text-[16px]"
        >
          {nums}
        </motion.p>
        <motion.i
          whileTap={{ scale: 0.9 }}
          className="fa-solid fa-plus inline-block cursor-pointer"
          onClick={() => addToCart(id)}
        ></motion.i>
      </motion.div>
    )
  )}
</AnimatePresence>

  );
}
