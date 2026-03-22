export const SITE = {
	website: "https://bjro.dev/",
	author: "Björn Roberg",
	profile: "https://bjro.dev/",
	desc: "Writing on AI agents, developer tooling, and software architecture — by Björn Roberg.",
	title: "Cogitate",
	ogImage: "astropaper-og.jpg",
	lightAndDarkMode: true,
	postPerIndex: 6,
	postPerPage: 8,
	scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
	showArchives: true,
	showBackButton: true, // show back button in post detail
	editPost: {
		enabled: true,
		text: "Edit page",
		url: "https://github.com/roobie/roobie.github.io/edit/master/",
	},
	dynamicOgImage: true,
	dir: "ltr", // "rtl" | "auto"
	lang: "en", // html lang code. Set this empty and default will be "en"
	timezone: "Europe/Stockholm", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
