import { apiClient } from "./client";

export const fetchTestTypes = () => apiClient.get("/test/types");

export const startTest = (payload) => apiClient.post("/test/start", payload);

export const submitTestAnswer = (payload) => apiClient.post("/test/submit", payload);

export const sendTestFaceEmotion = (payload) => apiClient.post("/test/face-emotion", payload);

export const completeTest = (payload) => apiClient.post("/test/complete", payload);

export const fetchTestResult = (testId) => apiClient.get(`/test/result/${testId}`);

export const saveTestResult = (payload) => apiClient.post("/test/result/save", payload);

export const saveTestPermissions = (payload) => apiClient.post("/test/permissions", payload);

export const downloadTestReportPdf = (testId) => apiClient.get(`/test/result/${testId}/pdf`);
