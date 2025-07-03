"use client";

import Icon from "@/components/Icon";
import { db, WatchedTitle } from "@/libs/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function MarkAsWatched(data: Omit<WatchedTitle, "date">) {
  const title = useLiveQuery(() => db.watchedTitle.get(data.id));

  return (
    <button
      onClick={() => {
        if (title === undefined) {
          db.watchedTitle.put({ ...data, date: new Date() });
        } else {
          db.watchedTitle.delete(data.id);
        }
      }}
      className={title !== undefined ? "text-green-500" : undefined}
    >
      <span>
        <span>{title !== undefined ? "Watched " : "Mark As Watched"}</span>
        {title !== undefined && <Icon name="check" />}
      </span>
    </button>
  );
}
