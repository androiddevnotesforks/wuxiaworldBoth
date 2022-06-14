import axios from "axios";
import { apiHome } from "./siteName.js";

const headers = {
  "Content-Type": "application/json",
};

export const leftFetch = ({ pageParam = 0 }) => {
  return axios
    .get(`${apiHome}/novels/?limit=12&offset=${pageParam * 12}`, {
      headers: headers,
    })
    .then((res) => {
      const data = res.data.results;

      return data;
    });
};
export const rightFetch = () => {
  return axios
    .get(`${apiHome}/search/?ordering=-views&search=&limit=5`, {
      headers: headers,
    })
    .then((res) => {
      const data = res.data.results;
      return data;
    });
};
