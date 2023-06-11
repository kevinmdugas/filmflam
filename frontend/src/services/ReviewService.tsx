import { httpClient } from "@/services/HttpService.tsx";

export const ReviewService ={
    async generateReview(titleId: string, userId: number | null) {
        const response = await httpClient.post("/reviews", {titleId: titleId, userId: userId});
        return response.data;
    }
}