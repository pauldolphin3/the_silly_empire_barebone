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
import { useCallback, useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useCallback(
    (direction: "left" | "right") => {
      const container = ref.current!;

      const x0 = 0;
      const x1 = container.clientWidth;

      function intersect(child: HTMLDivElement, parent: HTMLDivElement) {
        const x2 = child.offsetLeft - parent.scrollLeft;
        const x3 = x2 + child.clientWidth;

        const x4 = Math.max(Math.max(x0, x2), x0);
        const x5 = Math.min(x1, x3);
        const w = Math.max(x5 - x4, 0);

        return w;
      }

      let scrollAmount = 0;
      if (direction === "right") {
        for (let i = container.children.length - 1; i >= 0; --i) {
          const w = intersect(
            container.children.item(i) as HTMLDivElement,
            container
          );
          if (w > 0) {
            scrollAmount = x1 - w;
            break;
          }
        }
      } else {
        for (let i = 0; i < container.children.length; ++i) {
          const w = intersect(
            container.children.item(i) as HTMLDivElement,
            container
          );
          if (w > 0) {
            scrollAmount = (x1 - w) * -1;
            break;
          }
        }
      }

      if (scrollAmount !== 0) {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    },
    [ref]
  );

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
