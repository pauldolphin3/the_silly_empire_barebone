import MarkAsWatched from "@/components/MarkAsWatched";
import tmdb from "@/libs/tmdb";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await tmdb.movies.details(Number(id));

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div className="flex gap-4">
        <p className="text-lg font-bold">{movie.title}</p>
        <MarkAsWatched
          id={movie.id.toString()}
          name={movie.title}
          type={"movie"}
          imagePath={movie.poster_path === null ? undefined : movie.poster_path}
          releaseDate={new Date(movie.release_date + "T00:00:00.000Z")}
        />
      </div>

      <Link
        href={`/watch/${movie.id}`}
        className="hover:opacity-50 data-[disabled=true]:opacity-50"
      >
        {movie.poster_path != null && (
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            width={92}
            height={138}
            alt="poster"
          />
        )}
        <p>{movie.title}</p>
      </Link>
    </div>
  );
}
