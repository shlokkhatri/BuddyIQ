import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

export const getSubjects = async () => {
    const res = await api.get("/subjects");
    return res.data.subjects;
};

export const getChapters = async (subject: string) => {
    const res = await api.get(`/subjects/${subject}/chapters`);
    return res.data.chapters;
};

export const createQuiz = async (body: any) => {
    const res = await api.post("/quiz", body);
    return res.data;
};

export default api;