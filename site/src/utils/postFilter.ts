import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
	const isPublishTimePassed =
		Date.now() >
		new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
	const isDev = import.meta.env.DEV;
	return (isDev || !data.draft) && (isDev || isPublishTimePassed);
};

export default postFilter;
