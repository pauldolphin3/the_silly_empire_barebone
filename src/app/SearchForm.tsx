import Icon from "@/components/Icon";
import tmdb from "@/libs/tmdb";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { MovieWithMediaType, TVWithMediaType } from "tmdb-ts";

export default async function SearchForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let originalQuery = "";

  if (searchParams.query !== undefined) {
    if (typeof searchParams.query === "string")
      originalQuery = searchParams.query;
    else originalQuery = searchParams.query.join(); // Magari qui si può fare una ricerca multipla
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
        return (
          <p className="text-red-600 block text-xs pt-8">
            <Icon name="xmark-large" /> Error:{" "}
            {"page filter must be a valid number > 1"}
          </p>
        );
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
        return (
          <p className="text-red-600 block text-xs pt-8">
            <Icon name="xmark-large" /> Error:{" "}
            {'type filter can only be "tv" or "movie"'}
          </p>
        );
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
        return (
          <p className="text-red-600 block text-xs pt-8">
            <Icon name="xmark-large" /> Error:{" "}
            {"max filter must be a valid number"}
          </p>
        );
      }
      maxResults = value;
    }
    items = items.slice(0, maxResults);
  }

  return (
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
                  width={it.media_type == "movie" ? 92 : 96}
                  height={it.media_type == "movie" ? 138 : 54}
                  alt="poster"
                />
              )}
              <p>{it.media_type == "tv" ? it.name : it.title}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}
