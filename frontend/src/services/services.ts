import axios from "axios";

export async function getAllForm({ signal }: any) {
    const res = await axios.get("http://localhost:4000/api/form/meta_data", { signal: signal });
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.data;
}

export async function getFormById({ signal, selectedFormId }: any) {
    const response = await axios.get(`http://localhost:4000/api/form/meta_data/${selectedFormId}`, { signal: signal });
    await new Promise((resolve) => setTimeout(resolve, 500));
    return response.data;
}