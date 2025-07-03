"use client";

import Icon from "@/components/Icon";
import { db } from "@/libs/db";
import groupBy from "@/libs/groupBy";

export default function ExportWatched() {
  return (
    <button
      onClick={async () => {
        const titles = await db.watchedTitle.orderBy("date").toArray();
        const groupedByYear = groupBy(titles, (title) =>
          title.releaseDate.getFullYear().toString()
        );

        const dataStr = JSON.stringify(groupedByYear, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "watched-titles.json";
        link.click();

        URL.revokeObjectURL(url);
      }}
    >
      <Icon name="floppy-disk" />
    </button>
  );
}
