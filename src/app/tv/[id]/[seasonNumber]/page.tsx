import tmdb from "@/libs/tmdb";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; seasonNumber: string }>;
}) {
  const { id, seasonNumber } = await params;

  const season = await tmdb.tvSeasons.details({
    tvShowID: Number(id),
    seasonNumber: Number(seasonNumber),
  });

  return (
    <div className="pt-8 flex flex-col">
      <span className="text-lg font-bold">{season.name}</span>

      <div>
        {/* {items.length <= 0 && query.trim().length > 0 && (
          <span className="text-gray-600 block text-xs p-1">
            <Icon name="magnifying-glass" /> No results found - try different
            search terms
          </span>
        )} */}
        {
          /* items.length > 0 && */
          season.episodes.map((it) => (
            <Link
              key={`${id}-${seasonNumber}-${it.id}`}
              href={`/watch/${id}/${it.season_number}/${it.episode_number}`}
              className="hover:opacity-50 p-1"
            >
              {it.still_path != null && (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${it.still_path}`}
                  width={96}
                  height={54}
                  alt="poster"
                />
              )}
              <p>
                {it.episode_number}. {it.name}
              </p>
            </Link>
          ))
        }
      </div>
    </div>
  );
}
