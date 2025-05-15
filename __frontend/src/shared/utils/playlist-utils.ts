import type { TracksType } from "../../types";

// Get readable information about the track duration
export const getTracksDuration = (tracks: TracksType): string => {
  if (!tracks) return "";
  let totalDuration = 0;
  tracks.forEach((track) => {
    totalDuration += track.duration;
  });
  const totalMinute = Math.floor(totalDuration / 60);
  const resultMinute = totalMinute % 60;
  const resultHour = Math.floor(totalMinute / 60);
  return `${tracks.length} Tracks, about ${resultHour} hr ${resultMinute} min`;
};

// Get readable information about the track artist
export const getArtistName = (tracks: TracksType): string => {
  if (!tracks) return "";
  const artists = tracks.map(
    (track) => track.artists[0].first_name + " " + track.artists[0].last_name,
  );
  // Remove duplicate artists
  const uniqueArtists = Array.from(new Set(artists));
  return uniqueArtists.join(", ");
};
