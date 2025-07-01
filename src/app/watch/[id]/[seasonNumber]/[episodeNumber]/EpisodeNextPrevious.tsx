import Icon from "@/components/Icon";
import tmdb from "@/libs/tmdb";
import Image from "next/image";
import Link from "next/link";
import {
  AppendToResponse,
  AppendToResponseTvEpisodeKey,
  AppendToResponseTvKey,
  Episode,
  TvShowDetails,
} from "tmdb-ts";

export default async function EpisodeNextPrevious({
  title,
  episode,
  id,
  seasonNumber,
}: {
  title: AppendToResponse<
    TvShowDetails,
    AppendToResponseTvKey[] | undefined,
    "tvShow"
  >;
  episode: AppendToResponse<
    Omit<Episode, "show_id">,
    AppendToResponseTvEpisodeKey[] | undefined,
    "tvEpisode"
  >;
  id: number;
  seasonNumber: number;
}) {
  const currentSeasonIndex = title.seasons.findIndex(
    (season) => season.season_number === seasonNumber
  )!;

  let prevEpisodeSeason: number | undefined;
  let prevEpisodeNumber: number | undefined;
  if (episode.episode_number > 1) {
    prevEpisodeNumber = episode.episode_number - 1;
    prevEpisodeSeason = episode.season_number;
  } else {
    const prevSeason = title.seasons[currentSeasonIndex - 1];
    if (prevSeason !== undefined) {
      prevEpisodeNumber = prevSeason.episode_count;
      prevEpisodeSeason = prevSeason.season_number;
    }
  }

  let nextEpisodeSeason: number | undefined;
  let nextEpisodeNumber: number | undefined;
  if (
    episode.episode_number < title.seasons[currentSeasonIndex].episode_count
  ) {
    nextEpisodeNumber = episode.episode_number + 1;
    nextEpisodeSeason = episode.season_number;
  } else {
    const nextSeason = title.seasons[currentSeasonIndex + 1];
    if (nextSeason !== undefined) {
      nextEpisodeNumber = 1;
      nextEpisodeSeason = nextSeason.season_number;
    }
  }

  const data2 = await Promise.all([
    prevEpisodeNumber !== undefined
      ? tmdb.tvEpisode.details({
          tvShowID: id,
          seasonNumber: prevEpisodeSeason!,
          episodeNumber: prevEpisodeNumber,
        })
      : undefined,
    nextEpisodeNumber !== undefined
      ? tmdb.tvEpisode.details({
          tvShowID: id,
          seasonNumber: nextEpisodeSeason!,
          episodeNumber: nextEpisodeNumber,
        })
      : undefined,
  ]);

  const prevEpisode = data2[0];
  const nextEpisode = data2[1];

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex-1/2">
        {prevEpisode !== undefined && (
          <Link
            href={`/watch/${id}/${prevEpisode.season_number}/${prevEpisode.episode_number}`}
            className="hover:opacity-50 p-1 flex flex-col items-start h-full justify-end"
          >
            {prevEpisode.still_path !== undefined && (
              <Image
                src={`https://image.tmdb.org/t/p/original/${prevEpisode.still_path}`}
                width={96}
                height={54}
                alt="poster"
              />
            )}
            <p className="line-clamp-1">
              <Icon name="arrow-left" />
              <span>{` ${prevEpisode.name} S${prevEpisode.season_number} E${prevEpisode.episode_number}`}</span>
            </p>
          </Link>
        )}
      </div>

      <div className="flex-1/2">
        {nextEpisode !== undefined && (
          <Link
            href={`/watch/${id}/${nextEpisode.season_number}/${nextEpisode.episode_number}`}
            className="hover:opacity-50 p-1 flex flex-col items-end h-full justify-end"
          >
            {nextEpisode.still_path !== undefined && (
              <Image
                src={`https://image.tmdb.org/t/p/original/${nextEpisode.still_path}`}
                width={96}
                height={54}
                alt="poster"
              />
            )}
            <p className="line-clamp-1">
              <span>{`${nextEpisode.name} S${nextEpisode.season_number} E${nextEpisode.episode_number} `}</span>
              <Icon name="arrow-right" />
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
