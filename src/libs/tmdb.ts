import { TMDB } from "tmdb-ts";

const tmdb = new TMDB(process.env.TMDB_READ_ACCESS_TOKEN as string);
export default tmdb;
