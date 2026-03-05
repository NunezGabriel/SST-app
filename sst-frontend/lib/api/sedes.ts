import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Sede {
  id: number;
  nombre: string;
}

const headers = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getSedesRequest = async (token: string): Promise<Sede[]> => {
  const res = await axios.get(`${API_URL}/api/sedes`, { headers: headers(token) });
  return res.data;
};

export const createSedeRequest = async (token: string, nombre: string): Promise<Sede> => {
  const res = await axios.post(`${API_URL}/api/sedes`, { nombre }, { headers: headers(token) });
  return res.data;
};

export const updateSedeRequest = async (token: string, id: number, nombre: string): Promise<Sede> => {
  const res = await axios.put(`${API_URL}/api/sedes/${id}`, { nombre }, { headers: headers(token) });
  return res.data;
};

export const deleteSedeRequest = async (token: string, id: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/sedes/${id}`, { headers: headers(token) });
};

export const getSedeUsuariosCountRequest = async (token: string, id: number): Promise<number> => {
  const res = await axios.get(`${API_URL}/api/sedes/${id}/usuarios-count`, { headers: headers(token) });
  return res.data.count;
};