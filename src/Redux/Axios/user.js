import axios from "axios";

export const user = axios.create({
    baseURL: "http://localhost:8080/auth/login/success"
  });

