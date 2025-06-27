import Player from "@/components/Player";
import tmdb from "@/libs/tmdb";
import { vixsrcPlaylist } from "@/libs/vixsrc";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await Promise.all([
    tmdb.movies.details(Number(id)),
    vixsrcPlaylist(Number(id)),
  ]);

  const title = data[0];

  const playlist = data[1];
  if (playlist == false) {
    throw new Error(
      "Movie not available to watch yet (or something unbelievable happened)"
    );
  }

  return (
    <Player
      playlist={playlist}
      title={{
        id: id,
        name: title.title,
        imagePath: title.poster_path === null ? undefined : title.poster_path,
      }}
    />
  );
}
