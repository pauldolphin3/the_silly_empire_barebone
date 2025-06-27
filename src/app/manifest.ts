import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Silly Empire | barebone™",
    short_name: "The Silly Empire",
    id: "the_silly_empire_barebone",
    description: "",
    display: "standalone",
    display_override: ["window-controls-overlay"],
    start_url: "/",
    scope: "/",
    background_color: "#171717",
    theme_color: "#171717",
    icons: [
      {
        src: "/manifest-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
