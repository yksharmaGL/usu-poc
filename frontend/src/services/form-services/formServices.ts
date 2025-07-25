import HttpClient from "../httpClient";
import { AddFormDataParams, GetFormByIdParams } from "./formServicesTypes";


const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAllForm({ signal }: { signal: AbortSignal }) {
    const res = await HttpClient.get("/form/meta_data", { signal: signal });
    await delay(500);
    return res.data;
}

export async function getFormById({ signal, selectedFormId }: GetFormByIdParams) {
    const response = await HttpClient.get(`/form/meta_data/${selectedFormId}`, { signal: signal });
    await delay(500);
    return response.data;
}

export async function getFormSubmittedById({ signal, selectedFormId }: GetFormByIdParams) {
    const response = await HttpClient.get(`/form/submitted_forms/${selectedFormId}`, { signal: signal });
    await delay(500);
    return response.data;
}

export async function addFormData({data}: AddFormDataParams) {
    const response = await HttpClient.post(`/form/submitted_forms`,data);
    await delay(500);
    return response.data;
}