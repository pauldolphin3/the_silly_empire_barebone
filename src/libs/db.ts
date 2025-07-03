import Dexie, { type EntityTable } from "dexie";

interface ContinueWatchingTitle {
  id: string; // Why is this a string? (same for WatchedTitle)
  seasonNumber?: number;
  episodeNumber?: number;
  name: string;
  imagePath?: string;
  progressPercent: number;
  currentTime: number;
  lastUpdated: Date;
}

interface WatchedTitle {
  id: string;
  name: string;
  imagePath?: string;
  date: Date;
  releaseDate: Date;
  type: "movie" | "tv";
}

const db = new Dexie("db") as Dexie & {
  continueWatchingTitle: EntityTable<ContinueWatchingTitle, "id">;
  watchedTitle: EntityTable<WatchedTitle, "id">;
};

db.version(0.7).stores({
  continueWatchingTitle: "id, lastUpdated, [id+seasonNumber+episodeNumber]",
  watchedTitle: "id, date, releaseDate",
});

export { db };
export type { ContinueWatchingTitle, WatchedTitle };
