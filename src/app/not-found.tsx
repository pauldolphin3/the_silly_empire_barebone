import Icon from "@/components/Icon";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-8 text-xs space-y-2">
      <p className="text-red-600 block text-xs">
        <Icon name="xmark-large" /> Error: Unexisting endpoint
      </p>
      <Link
        href={"/"}
        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
