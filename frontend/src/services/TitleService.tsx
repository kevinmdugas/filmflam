import { httpClient } from "@/services/HttpService.tsx";

export const TitleService = {
	async fetchTitles(titleName: string) {
		const response = await httpClient.search("/titles", { titleName });
		return response.data;
	},
};
