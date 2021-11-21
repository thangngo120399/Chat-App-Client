import axios from "axios";
const API_URL = "https://classifytext.herokuapp.com/classify/";
const checkToxic = (text) => {
  return axios.get(API_URL + text);
};
export default {
  checkToxic,
};
