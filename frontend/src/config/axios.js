import axios from "axios";

const API = axios.create({
  baseURL: "http://ec2-43-204-156-110.ap-south-1.compute.amazonaws.com:3000",
});

export default API;
