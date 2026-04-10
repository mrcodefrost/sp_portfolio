import type { YouTubeBlockValue } from "../../types";

interface YouTubeBlockProps {
  value: YouTubeBlockValue;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function YouTubeBlock({ value }: YouTubeBlockProps) {
  const videoId = extractYouTubeId(value.url);

  if (!videoId) {
    return (
      <div className="my-8 p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
        Could not parse YouTube URL:{" "}
        <span className="font-mono">{value.url}</span>
      </div>
    );
  }

  return (
    <figure className="my-10">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={value.caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
      {value.caption && (
        <figcaption className="text-center text-sm text-gray-400 dark:text-slate-500 mt-3 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
