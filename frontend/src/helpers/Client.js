import axios from "axios";

const apiClient = 

class Client{
    constructor(){
        this.api = axios.create({
            baseURL: "http://localhost:8080/api",
            withCredentials: true,
          });
    };

    async get(url){

    };

    async post(url, data){

    };

    async delete(url, data){

    };
}