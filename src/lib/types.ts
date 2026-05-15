import type { site } from "@/config/site";
import type { GalleryTag } from "@/lib/images";

type Site = typeof site;

/**
 * The shape every component consumes via `useSite()`. Combines the original
 * site.ts content with the editable images/video/lists from the database.
 */
export type SiteData = Site & {
  heroImages: string[];
  heroVideoSrc: string;
  aboutImage: string;
  ctaImage: string;
  filmPoster: string;
  filmVideoSrc: string;

  gallery: {
    src: string;
    alt: string;
    tag: GalleryTag;
    h: number;
  }[];

  instagramGrid: string[];
  igPosts: {
    src: string;
    caption: string;
    likes: number;
    comments: number;
    plays?: number;
    kind: "post" | "reel";
  }[];
  igStories: {
    label: string;
    img: string;
    full: string;
    caption: string;
  }[];
  testimonialAvatars: string[];

  filmList: {
    title: string;
    location: string;
    duration: string;
    poster: string;
    videoSrc: string;
    kind: "feature" | "reel";
  }[];
};
