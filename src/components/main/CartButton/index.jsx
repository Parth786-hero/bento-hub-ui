import { motion, useAnimation } from "framer-motion";
import { useCartContext } from "../../../hooks/useCart";
import { useSelector , useDispatch} from "react-redux";
import { useMemo, useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import { changeModalStatus } from "../../../store/slices/modalSlice";
import { changeCartStatus } from "../../../store/slices/cartSlice";

export default function CartButton() {
  const dispatch = useDispatch();
  const [donation, setDonation] = useState(() => localStorage.getItem("donation") === "true");
 
  const { getTotalNumbersOfItems, getBag } = useCartContext();
  const { products, loading } = useSelector((bag) => bag.products);
  const { user } = useSelector(bag => bag.login);
  const {isOpen} = useSelector(bag=>bag.cart);
  const listOfAllProducts = useMemo(() => products.flatMap(obj => obj.products), [products]);
  const cartItems = getBag();
  const val = getTotalNumbersOfItems();

  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animate only when first item is added
  useEffect(() => {
    if (val === 1 && !hasAnimated) {
      controls.start({
        scale: [1, 1.2, 0.95, 1],
        boxShadow: [
          "0 0 0px rgba(0,0,0,0)",
          "0 0 12px rgba(0,128,0,0.4)",
          "0 0 0px rgba(0,0,0,0)"
        ],
        transition: { duration: 0.4, ease: "easeOut" }
      });
      setHasAnimated(true);
    }
  }, [val, hasAnimated, controls]);

  useEffect(() => {
    if (val === 0) {
      dispatch(changeCartStatus(false));
      setHasAnimated(false); // reset so animation can play again next time
    }
  }, [val]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, curr) => {
      const obj = listOfAllProducts.find(ele => ele.id === curr.id);
      if (!obj) return acc;
      const amount = curr.count * (obj.discounted_price > 0 ? obj.discounted_price : obj.price);
      return acc + amount;
    }, 0);
  }, [cartItems, listOfAllProducts]);

  useEffect(() => {
    localStorage.setItem("donation", donation);
  }, [donation]);
  
  return (
    <>
      {user.email === "kapoorparth096@gmail.com" ? (
        <motion.button
          className="cart-btn-1 rounded-md font-semibold shadow-md flex items-center justify-center gap-2 bg-green"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(changeModalStatus({ show: true, mode: "ADD_PRODUCT" }))}
        >
          <span className="font-extrabold text-[1rem]">Add Product</span>
        </motion.button>
      ) : loading ? (
        <motion.button disabled className="cart-btn rounded-md font-semibold shadow-md items-center justify-center gap-2 flex">
          <i className="text-[1rem] fa-solid fa-cart-shopping"></i>
          <span className="font-extrabold text-[1rem]">My Cart</span>
        </motion.button>
      ) : val > 0 ? (
        <>
          <motion.button
            animate={controls} // animate only on first item
            onClick={() => dispatch(changeCartStatus(true))}
            className="items-btn rounded-md font-semibold shadow-md flex items-center gap-2 px-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="text-[1.3rem] fa-solid fa-cart-shopping"></i>
            <div className="flex-col items-start justify-start text-[13px] tracking-wider font-extrabold flex">
              <p>{val} items</p>
              <p>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 2,
                }).format(totalPrice)}
              </p>
            </div>
          </motion.button>
          <BottomSheet
            isOpen={isOpen}
           
            donation={donation}
            setDonation={setDonation}
          />
        </>
      ) : (
        <motion.button disabled className="cart-btn rounded-md font-semibold shadow-md flex items-center justify-center gap-2">
          <i className="text-[1rem] fa-solid fa-cart-shopping"></i>
          <span className="font-extrabold text-[1rem]">My Cart</span>
        </motion.button>
      )}
    </>
  );
 
}
