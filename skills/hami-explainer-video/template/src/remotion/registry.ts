import type React from "react";

export interface VideoEntry {
  /** Composition id: PascalCase of the video name, e.g. "GpuSharingBenchmarks". */
  id: string;
  /** The explainer video. Rendered once per language with --public-dir videos/<name>/<lang>/. */
  Video: React.FC;
  /** Cover image for the video. */
  Thumbnail: React.FC<{ aspectRatio: "16:9" | "4:3" }>;
  /** Image cards for 小绿书 and LinkedIn, in reading order. Omit if the video has none. */
  cards?: React.FC[];
}

// Register each video here.
//
// import { Video as GpuVideo } from "./compositions/gpu-sharing-benchmarks/Video";
// import { Thumbnail as GpuThumbnail } from "./compositions/gpu-sharing-benchmarks/Thumbnail";
// import { cards as gpuCards } from "./compositions/gpu-sharing-benchmarks/Cards";
export const VIDEOS: VideoEntry[] = [
  // { id: "GpuSharingBenchmarks", Video: GpuVideo, Thumbnail: GpuThumbnail, cards: gpuCards },
];
