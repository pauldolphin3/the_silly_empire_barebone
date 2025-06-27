"use client";

import Icon from "@/components/Icon";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <p className="text-red-600 block text-xs pt-8">
      <Icon name="xmark-large" /> Error: {error.message}
    </p>
  );
}
