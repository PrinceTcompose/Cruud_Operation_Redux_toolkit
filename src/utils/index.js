import axios from "axios"

export const axiosAPICall = async (endPoint, method, obj) => {
    try {
        if (method === "post" || method === "put") {
            const response = await axios[method](`https://crudcrud.com/api/deddbe8cc70c4537b8a39904e943e6b7/${endPoint}`, obj)
            if ((method === "put" && response.status === 200) || (method === "post" && response.status === 201)) {
                return response.data;
            } else {
                return "something went wrong";
            }
        }
        else {
            const response = await axios[method](`https://crudcrud.com/api/deddbe8cc70c4537b8a39904e943e6b7/${endPoint}`)
            if (response.status === 200) {
                // console.log("Responce Data == = > ", response.data);
                return response.data;
            } else {
                return "something went wrong";
            }
        }

    } catch (error) {
        console.log(error);
    }
}