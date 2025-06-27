export async function vixsrcPlaylist(
  id: number,
  seasonNumber?: number,
  episodeNumber?: number
) {
  const result = await fetch(
    seasonNumber !== undefined
      ? `https://vixsrc.to/tv/${id}/${seasonNumber}/${episodeNumber}/`
      : `https://vixsrc.to/movie/${id}`,
    {
      cache: "no-cache",
    }
  );

  if (result.status !== 200) {
    return false;
  }

  const text = await result.text();
  const playlistData = new RegExp(
    "token': '(.+)',\n[ ]+'expires': '(.+)',\n.+\n.+\n.+url: '(.+)',\n[ ]+}\n[ ]+window.canPlayFHD = (false|true)"
  ).exec(text)!;

  const token = playlistData[1];
  const expires = playlistData[2];
  const playlistUrl = new URL(playlistData[3]);
  const canPlayFHD = playlistData[4];
  const b = playlistUrl.searchParams.get("b");

  playlistUrl.searchParams.append("token", token);
  playlistUrl.searchParams.append("expires", expires);
  if (b !== null) playlistUrl.searchParams.append("b", b);
  if (canPlayFHD === "true") playlistUrl.searchParams.append("h", "1");

  return playlistUrl.toString();
}
