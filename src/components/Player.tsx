"use client";

import { db } from "@/libs/db";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { useEffect, useRef } from "react";

export default function Player({
  playlist,
  title,
}: {
  playlist: string;
  title: {
    id: string;
    seasonNumber?: number;
    episodeNumber?: number;
    name: string;
    imagePath?: string;
  };
}) {
  const ref = useRef<MediaPlayerInstance>(null);
  const isFirstUpdate = useRef(true);

  useEffect(() => {
    isFirstUpdate.current = true;
    (async () => {
      const data = await db.continueWatchingTitle
        .where(
          title.seasonNumber !== undefined
            ? {
                id: title.id,
                seasonNumber: title.seasonNumber,
                episodeNumber: title.episodeNumber,
              }
            : { id: title.id }
        )
        .first();
      if (data === undefined) return;
      ref.current!.currentTime = data.currentTime;
    })();
  }, [ref, title.id, title.seasonNumber, title.episodeNumber]);

  return (
    <MediaPlayer
      ref={ref}
      className="mt-4 w-full aspect-auto"
      title={
        title.seasonNumber !== undefined
          ? `${title.name} S${title.seasonNumber} E${title.episodeNumber}`
          : title.name
      }
      src={{ src: playlist, type: "application/vnd.apple.mpegurl" }}
      onHlsLibLoaded={(detail) => {
        detail.DefaultConfig.xhrSetup = (xhr, url) => {
          if (url.endsWith("storage/enc.key")) {
            url = "https://vixsrc.to/storage/enc.key";
          }
          xhr.open("GET", `/proxy/${encodeURIComponent(url)}`);
        };
      }}
      onHlsError={(data) => {
        console.log(data);
      }}
      storage={"player-storage"}
      preferNativeHLS={false}
      onTimeUpdate={(detail, e) => {
        if (isFirstUpdate.current) {
          isFirstUpdate.current = false;
          return;
        }
        db.continueWatchingTitle.put({
          currentTime: detail.currentTime,
          lastUpdated: new Date(),
          progressPercent: detail.currentTime / e.target.duration,
          id: title.id,
          seasonNumber: title.seasonNumber,
          episodeNumber: title.episodeNumber,
          name: title.name,
          imagePath: title.imagePath,
        });
      }}
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
    </MediaPlayer>
  );
}

// "use client";

// import Hls, { ErrorData, Events } from "hls.js";
// import { useEffect, useRef } from "react";

// export default function Player({
//   playlist,
//   title,
// }: {
//   playlist: string;
//   title: string;
// }) {
//   const ref = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = ref.current;
//     if (video == null) return;
//     if (!Hls.isSupported()) throw new Error("hls.js is not supported");

//     const hls = new Hls({
//       xhrSetup(xhr, url) {
//         if (url.endsWith("storage/enc.key")) {
//           url = "https://vixsrc.to/storage/enc.key";
//         }
//         xhr.open("GET", `/proxy/${encodeURIComponent(url)}`);
//       },
//     });
//     hls.on(Events.ERROR, (event: Events.ERROR, data: ErrorData) => {
//       console.log(event, data);
//     });
//     hls.loadSource(playlist);
//     hls.attachMedia(video);

//     return () => {
//       hls.destroy();
//     };
//   }, [ref, playlist]);

//   return (
//     <video
//       ref={ref}
//       controls
//       title={title}
//       className="w-full aspect-auto pt-4"
//     ></video>
//   );
// }
