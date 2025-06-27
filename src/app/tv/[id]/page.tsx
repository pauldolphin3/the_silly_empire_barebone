import tmdb from "@/libs/tmdb";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const series = await tmdb.tvShows.details(Number(id));

  return (
    <div className="pt-8 flex flex-col">
      <p className="text-lg font-bold">{series.name}</p>

      <div>
        {/* {items.length <= 0 && query.trim().length > 0 && (
          <span className="text-gray-600 block text-xs p-1">
            <Icon name="magnifying-glass" /> No results found - try different
            search terms
          </span>
        )} */}
        {
          /* items.length > 0 && */
          series.seasons.map((it) => {
            const hasEpisodes = it.episode_count > 0;
            return (
              <Link
                key={`${id}-${it.id}`}
                href={hasEpisodes ? `/tv/${id}/${it.season_number}` : ""}
                className="hover:opacity-50 p-1 data-[disabled=true]:opacity-50"
                data-disabled={!hasEpisodes}
              >
                {it.poster_path != null && (
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${it.poster_path}`}
                    width={92}
                    height={138}
                    alt="poster"
                  />
                )}
                <p>
                  {it.name}
                  <span className="text-orange-600 text-sm pl-2">
                    {!hasEpisodes && "No episodes available yet"}
                  </span>
                </p>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
}
