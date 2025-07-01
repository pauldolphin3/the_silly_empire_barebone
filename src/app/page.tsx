import SearchForm from "@/app/SearchForm";
import ContinueWatching from "@/components/ContinueWatching";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-8 pt-8">
      <ContinueWatching />

      <Suspense>
        <SearchForm searchParams={params} />
      </Suspense>
    </div>
  );
}
