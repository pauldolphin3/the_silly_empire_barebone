"use client";

import ExportWatched from "@/components/ExportWatched";
import Icon from "@/components/Icon";
import { db } from "@/libs/db";
import groupBy from "@/libs/groupBy";
import jaroWinkler from "@/libs/jaroWinkler";
import { useLiveQuery } from "dexie-react-hooks";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";

export default function PageClient({
  originalQuery,
  query,
}: {
  originalQuery: string;
  query: string;
}) {
  const items = useLiveQuery(async () => {
    let data = await db.watchedTitle.orderBy("date").toArray();
    const total = data.length;

    if (query.length > 0) {
      data = data.filter((title) => {
        return jaroWinkler.calculate(title.name, query) >= 0.75;
      });
    }
    const count = data.length;

    return {
      data: Object.entries(
        groupBy(data, (title) => title.releaseDate.getFullYear().toString())
      ),
      count,
      total,
    };
  }, [query]);

  return (
    <div className="space-y-8 pt-8">
      <div className="flex gap-4">
        <p className="text-lg font-bold">
          {items !== undefined && (
            <span className="italic opacity-60">
              {query.length <= 0
                ? items.total
                : `${items.count}/${items.total}`}
            </span>
          )}{" "}
          Watched Titles
        </p>

        <ExportWatched />
      </div>

      <Form action={"/watched"} className="w-full group">
        <input
          name="query"
          type="search"
          id="query-input"
          placeholder="Search for a title"
          defaultValue={originalQuery}
          className="w-full group-hover:not-focus:opacity-50"
        />
      </Form>

      {items !== undefined && items.count <= 0 && query.length > 0 && (
        <span className="text-gray-600 block text-xs p-1">
          <Icon name="magnifying-glass" /> No results found - try different
          search terms
        </span>
      )}

      {items !== undefined && items.count > 0 && (
        <div className="flex flex-col gap-6">
          {items.data.map(([year, titles]) => (
            <div
              className="flex flex-col gap-4"
              key={`${year}-${titles.length}`}
            >
              <p className="text-lg font-bold">{year}</p>

              {titles.map((it) => (
                <div
                  className="flex flex-col shrink-0"
                  key={`${it.id}-${it.date}`}
                >
                  <Link
                    href={`/${it.type}/${it.id}`}
                    className="hover:opacity-50 p-1"
                  >
                    {it.imagePath !== undefined && (
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${it.imagePath}`}
                        width={96}
                        height={54}
                        alt="poster"
                      />
                    )}
                    <p>{it.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
