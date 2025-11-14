import { TMDB } from "tmdb-ts";

const tmdb = new TMDB(process.env.TMDB_READ_ACCESS_TOKEN as string);
export default tmdb;

export async function tmdbCatchResourceNotFoundError<T>(
  request: Promise<T>
): Promise<T | undefined> {
  return request.catch((err) => {
    if (err.status_code === 34) return undefined;
    else throw new Error(JSON.stringify(err));
  });
}
