import Icon from "@/components/Icon";
import Player from "@/components/Player";
import tmdb, { tmdbCatchResourceNotFoundError } from "@/libs/tmdb";
import { vixsrcPlaylist } from "@/libs/vixsrc";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
}) {
  const { id, seasonNumber, episodeNumber } = await params;

  const data = await Promise.all([
    tmdb.tvShows.details(Number(id)),
    tmdbCatchResourceNotFoundError(
      // Sometimes, happens that, for example, 5 seasons of a tv series are organized as 3 seasons with also less episodes but that last more in tmdb, with respect to vixsrc.
      tmdb.tvEpisode.details({
        tvShowID: Number(id),
        seasonNumber: Number(seasonNumber),
        episodeNumber: Number(episodeNumber),
      })
    ),
    vixsrcPlaylist(Number(id), Number(seasonNumber), Number(episodeNumber)),
  ]);

  const playlist = data[2];
  if (playlist == false) {
    return (
      <p className="text-red-600 block text-xs pt-8">
        <Icon name="xmark-large" /> Error: Episode not available to watch yet
        (or something unbelievable happened)
      </p>
    );
  }

  const title = data[0];
  const episode = data[1];

  return (
    <div>
      <Player
        playlist={playlist}
        title={{
          id: id,
          name: title.name,
          episodeNumber: Number(episodeNumber),
          seasonNumber: Number(seasonNumber),
          imagePath:
            episode === undefined || episode.still_path === null
              ? undefined
              : episode.still_path,
          episodeName: episode?.name,
        }}
      />
    </div>
  );
}
