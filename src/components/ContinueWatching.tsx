"use client";

import Icon from "@/components/Icon";
import { db } from "@/libs/db";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";

export default function ContinueWatching() {
  const items = useLiveQuery(() => {
    return db.continueWatchingTitle.orderBy("lastUpdated").reverse().toArray();
  });
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
  if (items === undefined || items.length <= 0) return;
  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-5 bg-black/50 w-10 top-0 h-full group-hover:opacity-100 opacity-0"
      >
        <Icon name="chevron-left" />
      </button>

      <div
        ref={ref}
        className="flex flex-row items-end gap-4 overflow-x-scroll scrollbar-hide"
      >
        {items.map((it) =>
          it.seasonNumber === undefined ? (
            <div className="flex flex-col shrink-0" key={it.id}>
              <Link href={`/watch/${it.id}`} className="hover:opacity-50 p-1">
                {it.imagePath !== undefined && (
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${it.imagePath}`}
                    width={92}
                    height={138}
                    alt="poster"
                  />
                )}
                <p>{it.name}</p>
              </Link>
              <span className="w-full h-1 rounded bg-gray-500">
                <span
                  className="h-1 block rounded bg-red-500"
                  style={{ width: `${it.progressPercent * 100}%` }}
                ></span>
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col shrink-0"
              key={`${it.id}-${it.seasonNumber}-${it.episodeNumber}`}
            >
              <Link
                href={`/watch/${it.id}/${it.seasonNumber}/${it.episodeNumber}`}
                className="hover:opacity-50 p-1"
              >
                {it.imagePath !== undefined && (
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${it.imagePath}`}
                    width={92}
                    height={138}
                    alt="poster"
                  />
                )}
                <p>{`${it.name} S${it.seasonNumber}E${it.episodeNumber}`}</p>
              </Link>
              <span className="w-full h-1 rounded bg-gray-500">
                <span
                  className="h-1 block rounded bg-red-500"
                  style={{ width: `${it.progressPercent * 100}%` }}
                ></span>
              </span>
            </div>
          )
        )}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-5 bg-black/50 w-10 top-0 h-full group-hover:opacity-100 opacity-0"
      >
        <Icon name="chevron-right" />
      </button>
    </div>
  );
}
