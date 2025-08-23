import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="pt-8 flex flex-col gap-4">
      <Link
        href={"https://www.themoviedb.org"}
        target="_blank"
        className="w-full hover:opacity-50"
      >
        <Image
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt="tmdb logo"
          width={100}
          height={13}
        />
      </Link>
      <Link
        href={"https://vixsrc.to"}
        target="_blank"
        className="w-full hover:opacity-50"
      >
        <Image src="/vixsrc.ico" alt="vixsrc logo" width={51} height={55} />
      </Link>
      <Link
        href={"https://github.com/pauldolphin3/the_silly_empire_barebone"}
        target="_blank"
        className="w-full hover:opacity-50"
      >
        <Image
          src="/github-142-svgrepo-com.svg"
          alt="github logo"
          width={48}
          height={48}
        />
      </Link>
      <Link
        href={"https://t.me/thesillyempirebarebone"}
        target="_blank"
        className="w-full hover:opacity-50"
      >
        <Image
          src="/telegram-svgrepo-com.svg"
          alt="telegram logo"
          width={48}
          height={48}
        />
      </Link>
    </div>
  );
}
