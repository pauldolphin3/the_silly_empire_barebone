import "./icon.css";
import localFont from "next/font/local";

const iconFont = localFont({
  src: "./fa-solid-900.woff2",
});

export default function Icon({
  className = "text-base",
  name,
}: {
  className?: string;
  name: string;
}) {
  return (
    <span className={`${iconFont.className} icon-${name} ${className}`}></span>
  );
}
