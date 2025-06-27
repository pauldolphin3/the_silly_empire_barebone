import Dexie, { type EntityTable } from "dexie";

interface ContinueWatchingTitle {
  id: string;
  seasonNumber?: number;
  episodeNumber?: number;
  name: string;
  imagePath?: string;
  progressPercent: number;
  currentTime: number;
  lastUpdated: Date;
}

const db = new Dexie("db") as Dexie & {
  continueWatchingTitle: EntityTable<ContinueWatchingTitle, "id">;
};

db.version(0.4).stores({
  continueWatchingTitle: "id, lastUpdated, [id+seasonNumber+episodeNumber]",
});

export { db };
export type { ContinueWatchingTitle };
