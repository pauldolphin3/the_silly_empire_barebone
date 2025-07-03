"use client";

import Icon from "@/components/Icon";
import { db, WatchedTitle } from "@/libs/db";

export default function ImportWatched() {
  return (
    <>
      <input
        className="hidden pointer-events-none"
        accept=".json"
        type="file"
        onChange={async (e) => {
          if (e.target.files === null) return;
          const file = e.target.files[0];
          const data = Object.values(
            JSON.parse((await file.text()) as string) as Record<
              string,
              WatchedTitle[]
            >
          );
          const promises = [];
          for (const a of data) {
            for (const title of a) {
              promises.push(
                db.watchedTitle.put({
                  date: new Date(title.date),
                  releaseDate: new Date(title.releaseDate),
                  name: title.name,
                  type: title.type,
                  id: title.id,
                  imagePath: title.imagePath,
                })
              );
            }
          }
          await Promise.all(promises);
        }}
        id="import-input"
      />
      <label
        htmlFor="import-input"
        className="flex justify-center items-center"
      >
        <Icon name="up-to-bracket" />
      </label>
    </>
  );
}
