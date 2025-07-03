import PageClient from "@/app/watched/page.client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let originalQuery = "";

  const params = await searchParams;
  if (params.query !== undefined) {
    if (typeof params.query === "string") originalQuery = params.query;
    else originalQuery = params.query.join(); // Magari qui si può fare una ricerca multipla
  }

  const query = originalQuery.trim();

  return <PageClient originalQuery={originalQuery} query={query} />;
}
