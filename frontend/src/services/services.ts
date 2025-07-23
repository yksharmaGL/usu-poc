import axios from "axios";

export async function getAllForm() {
    const res = await axios.get("http://localhost:4000/api/form/meta_data");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.data;
}