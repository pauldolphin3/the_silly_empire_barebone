import ContinueWatching from "@/components/ContinueWatching";
import Icon from "@/components/Icon";
import tmdb from "@/libs/tmdb";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { MovieWithMediaType, TVWithMediaType } from "tmdb-ts";

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

  let items: (MovieWithMediaType | TVWithMediaType)[] = [];
  let query = originalQuery.trim();
  if (query.length > 0) {
    const filters = Object.fromEntries(
      query.matchAll(/\{(\w+):(\w+)\}/g).map((match) => [match[1], match[2]])
    );

    if (Object.keys(filters).length > 0) {
      query = query.substring(0, query.indexOf("{"));
      query = query.trimEnd();
    }

    let page = 0;
    if ("page" in filters) {
      const value = Number(filters.page);
      if (Number.isNaN(value) || value < 1) {
        throw new Error("page filter must be a valid number > 1");
      }
      page = value;
    }

    if ("type" in filters) {
      const type = filters.type;
      if (type == "tv") {
        items = (
          await tmdb.search.tvShows({
            include_adult: true,
            query: query,
            page: page,
          })
        ).results.map((it) => {
          (it as TVWithMediaType).media_type = "tv";
          return it as TVWithMediaType;
        });
      } else if (type == "movie") {
        items = (
          await tmdb.search.movies({
            include_adult: true,
            query: query,
            page: page,
          })
        ).results.map((it) => {
          (it as MovieWithMediaType).media_type = "movie";
          return it as MovieWithMediaType;
        });
      } else {
        throw new Error('type filter can only be "tv" or "movie"');
      }
    } else {
      items = (
        await tmdb.search.multi({
          include_adult: true,
          query: query,
          page: page,
        })
      ).results.filter(
        (it) => it.media_type == "tv" || it.media_type == "movie"
      );
    }

    let maxResults = 3;
    if ("max" in filters) {
      const value = Number(filters.max);
      if (Number.isNaN(value)) {
        throw new Error("max filter must be a valid number");
      }
      maxResults = value;
    }
    items = items.slice(0, maxResults);
  }

  return (
    <div className="space-y-8 pt-8">
      <ContinueWatching />

      <div className="space-y-4">
        <Form action={"/"} className="w-full group">
          <input
            name="query"
            type="search"
            id="query-input"
            placeholder="Search for a title"
            defaultValue={originalQuery}
            className="w-full group-hover:not-focus:opacity-50"
          />
          <label
            htmlFor="query-input"
            className="group-hover:not-group-focus-within:opacity-50 text-orange-600 block text-xs"
          >
            <Icon name="lightbulb" /> Tip: Only 3 results displayed by default -
            be specific
          </label>
          <label
            htmlFor="query-input"
            className="group-hover:not-group-focus-within:opacity-50 text-orange-600 block text-xs"
          >
            <Icon name="lightbulb" /> Tip: Use filters at the end -{" "}
            {"{<type|max|page>:<value>}"}
          </label>
        </Form>

        <div className="flex flex-col gap-4 pb-12">
          {items.length <= 0 && originalQuery.trim().length > 0 && (
            <span className="text-gray-600 block text-xs p-1">
              <Icon name="magnifying-glass" /> No results found - try different
              search terms
            </span>
          )}
          {items.length > 0 &&
            items.map((it) => (
              <Link
                key={it.id}
                href={
                  it.media_type == "movie" ? `/watch/${it.id}` : `/tv/${it.id}`
                }
                className="hover:opacity-50"
              >
                {it.poster_path != null && (
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${it.poster_path}`}
                    width={92}
                    height={138}
                    alt="poster"
                  />
                )}
                <p>{it.media_type == "tv" ? it.name : it.title}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
