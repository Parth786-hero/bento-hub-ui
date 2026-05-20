
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import MiniLoader from "../../utilis/MiniLoader";
import ProductCard from "./Products/ProductCard";
import { fetchProductsOnScroll } from "../../store/slices/productsOnScrollSlice";

export default function ProductsOnScroll() {
  const dispatch = useDispatch();
  const loaderRef = useRef(null);
  const { items, loading, error, hasMore, lastId } = useSelector(
    (bag) => bag.productsOnScroll
  );

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProductsOnScroll({ limit: 6 }));
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        dispatch(fetchProductsOnScroll({ limit: 6, lastId }));
      }
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, lastId, dispatch]);

  return (
    <div className="mt-[11rem] md:mt-[7.3rem] relative">
      {error && (
        <p className="text-center text-red-500 text-lg tracking-wider font-bold my-6">
          {error}
        </p>
      )}

      {items.length === 0 && !loading && !error && (
        <p className="text-center text-[3rem] text-gray-400 font-bold my-9">
          No Products to show...
        </p>
      )}

      <div className="grid grid-cols-3 md:grid-cols-7 py-1 flex-wrap gap-2 md:gap-5">
        {items.map((p) => (
          <ProductCard key={p.id} data={p} />
        ))}
      </div>

      {loading && (
        <div className="text-center font-bold tracking-wider flex items-center justify-center gap-2 my-4">
          <span className="block">fetching... </span>
          <MiniLoader />
        </div>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-800 text-lg md:text-[1.8rem] tracking-wider font-bold mt-3">
          You reached end...Nothing to Display.
        </p>
      )}

      {!error && <div ref={loaderRef} style={{ height: "20px" }} />}
    </div>
  );
}
