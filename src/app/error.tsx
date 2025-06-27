"use client";

import Icon from "@/components/Icon";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="pt-8 text-xs space-y-2">
      <p className="text-red-600 block text-xs">
        <Icon name="xmark-large" /> Error: {error.message}
      </p>
      <button
        onClick={reset}
        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
