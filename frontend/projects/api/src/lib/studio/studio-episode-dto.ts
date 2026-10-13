/** The companion YouTube episode of a review. */
export interface StudioEpisodeDto {
  videoId: string;
  title: string;
  /** Uploaded poster shown until the visitor plays the episode. */
  posterUrl: string;
}
