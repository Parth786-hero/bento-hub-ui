export default function UserAddress({ user }) {
  return (
    <>
      <div className="cursor-pointer p-0.5">
        <h2 className="text-lg md:text-xl font-black tracking-wide mb-[.2rem]">
          Delivery in 10 mins
        </h2>
        <div className="flex items-center justify-end md:justify-start gap-1">
          <p className="text-sm md:text-[16px] font-medium capitalize">
            {user && user.street.length > 17
              ? user.street.slice(0, 18) + "...."
              : user.street}
              
          </p>
          <i className="fa-solid fa-angle-down"></i>
        </div>
      </div>
    </>
  );
}
