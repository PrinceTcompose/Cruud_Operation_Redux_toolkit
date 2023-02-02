import axios from "axios"

export const axiosAPICall = async (endPoint, method, obj) => {
    try {
        if (method == "post" || method == "put") {
            const response = await axios[method](`https://crudcrud.com/api/eb51753fa8584558abe3ec476eba7f14/${endPoint}`, obj)
            if ((method == "put" && response.status == 200) || (method == "post" && response.status == 201)) {
                return response.data;
            } else {
                return "something went wrong";
            }
        }
        else {
            const response = await axios[method](`https://crudcrud.com/api/eb51753fa8584558abe3ec476eba7f14/${endPoint}`)
            if (response.status == 200) {
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