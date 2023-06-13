import { httpClient } from "@/services/HttpService.tsx";

export const ReviewService = {
	async generateReview(titleId: string, loginUID: string | null) {
		const response = await httpClient.post("/reviews", { titleId: titleId, loginUID: loginUID });
		return response.data;
	},
};
