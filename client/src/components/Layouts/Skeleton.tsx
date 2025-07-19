const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  color = "",
  className = "",
  animation = "pulse", // "pulse" or "shimmer"
}) => {
  const defaultColor = "bg-zinc-300 dark:bg-gray-700";

  return (
    <div
      className={`${
        animation === "pulse" ? "animate-pulse" : "skeleton-shimmer"
      } ${width} ${height} ${rounded} ${color || defaultColor} ${className}`}
    />
  );
};

export default Skeleton;
