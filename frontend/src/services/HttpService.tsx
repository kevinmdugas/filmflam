import axios, { AxiosInstance, AxiosResponse } from "axios";

const serverIP = import.meta.env.API_HOST;
const serverPort = import.meta.env.PORT;

const serverUrl = `http://${serverIP}:${serverPort}`;

interface SearchableAxiosInstance extends AxiosInstance {
	search<T = any, R = AxiosResponse<T>>(path: string, data: any): Promise<R>;
}

const httpClient: SearchableAxiosInstance = axios.create({
	baseURL: serverUrl,
	headers: {
		"Content-type": "application/json",
	},
}) as SearchableAxiosInstance;

httpClient.search = async (path, data) => {
	const config = {
		method: "SEARCH",
		url: serverUrl + path,
		data,
	};
	return httpClient.request(config);
};

export { httpClient };
