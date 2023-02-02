import React, { useEffect, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import "./style.css"
import Modal from './Modal';
import List from './List';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mycontext = createContext();

const App = () => {

  const [item, setItem] = useState({
    name: "",
    email: "",
    contact_no: "",
    date_of_birth: "",
    address: ""
  });

  const [locdata, setLocData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editedItem, seteditedItem] = useState(null);
  const [mError, setMerror] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const fetchData = async () => {
    try {
      // const res = await axios.get("https://crudcrud.com/api/a3213d631a29425887e656e3249bbacd/users");
      const { data: res } = await axios.get("https://crudcrud.com/api/a3213d631a29425887e656e3249bbacd/users");
      // const data = res.data;
      // setLocData(data);
      setLocData(res);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onAdduserFun = () => {
    setEdit(false);
    setItem({
      name: "",
      email: "",
      contact_no: "",
      date_of_birth: "",
      address: ""
    });
    seteditedItem(null);
  }

  const setApiData = () => {
    axios.post('https://crudcrud.com/api/a3213d631a29425887e656e3249bbacd/users', {
      name: item.name,
      email: item.email,
      contact_no: item.contact_no,
      date_of_birth: item.date_of_birth,
      address: item.address
    });

  }

  const setEditApiData = (id) => {
    axios.put(`https://crudcrud.com/api/a3213d631a29425887e656e3249bbacd/users/${id}`, {
      name: item.name,
      email: item.email,
      contact_no: item.contact_no,
      date_of_birth: item.date_of_birth,
      address: item.address
    })
  }

  console.log("Local Data ==> ", locdata);


  const getData = (e) => {
    e.preventDefault();
    if (item.name == "" || item.email == "" || item.contact_no == "" || item.date_of_birth == "" || item.address == "" || mError !== "") {
      // alert("Please Fill All the Data");
      toast.error('Please Fill All Data !', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (edit && (item.name !== "" && item.email !== "" && item.contact_no !== "" && item.date_of_birth !== "" && item.address !== "" && mError == "")) {
      // setLocData(locdata.map((val) => {
      //   if (val._id == editedItem._id) return item;
      //   return val;
      // }))       
      let email = locdata.find((val) => {
        return item.email != editedEmail && val.email == item.email;
      });
      if (!email) {
        setEditApiData(editedItem._id);
        fetchData();
        setEdit(false);
        seteditedItem(null);
        setItem({
          name: "",
          email: "",
          contact_no: "",
          date_of_birth: "",
          address: ""
        })
        toast.success('Task Updated Successfully !', {
          position: toast.POSITION.TOP_RIGHT
        });

      }
      else {
        // alert("This Email is Already registered");
        toast.error('This Email is Already registered !', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
    else {
      // setLocData([...locdata, item]);
      let email = locdata.find((val) => {
        return val.email == item.email;
      });

      if (!email) {

        setApiData();
        fetchData();
        setItem({
          name: "",
          email: "",
          contact_no: "",
          date_of_birth: "",
          address: ""
        });
        toast.success('Task Added Successfully !', {
          position: toast.POSITION.TOP_RIGHT
        });

      }
      else {
        // alert("Your Email is Already registered");
        toast.error('This Email is Already registered !', {
          position: toast.POSITION.TOP_RIGHT
        });
      }


    }

  }


  const handleChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    setItem({ ...item, [name]: val })
  }

  const updateItem = (id) => {
    setEdit(true);
    let mydata = locdata.find((val) => {
      return val._id == id;
    })
    seteditedItem(mydata);
    setEditedEmail(mydata.email);

    setItem({
      name: mydata.name,
      email: mydata.email,
      contact_no: mydata.contact_no,
      date_of_birth: mydata.date_of_birth,
      address: mydata.address
    });
  }
  const setDelApiData = (id) => {
    try {
      axios.delete(`https://crudcrud.com/api/a3213d631a29425887e656e3249bbacd/users/${id}`);
    } catch (error) {
      console.log(error);
    }

  }
  const deleteItem = (id) => {
    // setLocData(locdata.filter((val) => val._id != id));
    setDelApiData(id);
    fetchData();
    toast.error('Task Deleted Successfully !', {
      position: toast.POSITION.TOP_RIGHT
    });
    // window.location.reload(true);
  }

  const validateMobile = () => {
    if (item.contact_no.length !== 10 || isNaN(item.contact_no)) {
      setMerror("Plz enter 10 Digit Number")
    }
  }

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />

      <div className="container">
        <div className="row text-center mt-5">
          <h3>User Data</h3>
        </div>

        <button type="button" className="btn btn-add mb-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={onAdduserFun}>
          Add User
        </button>

        <div className="table-responsive">
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th scope="col" className='text-center'>Name</th>
                <th scope="col" className='text-center'>Email</th>
                <th scope="col" className='text-center'>Contact No</th>
                <th scope="col" className='text-center'>DOB</th>
                <th scope="col" className='text-center'>Address</th>
                <th scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {
                (locdata.length > 0) && locdata.map((val, ind) => {
                  return (
                    <List key={ind} val={val} deleteItem={deleteItem} updateItem={updateItem} />
                  )
                })
              }
            </tbody>
          </table>
          {!locdata.length > 0 && <div className='mt-2 text-center w-100'>No Data Found</div>}
        </div>

        <mycontext.Provider value={[item, edit, setEdit, mError, setMerror]}>
          <Modal handleChange={handleChange} getData={getData} onAdduserFun={onAdduserFun} validateMobile={validateMobile} />
        </mycontext.Provider>
      </div >
    </>
  )
}

export default App
export { mycontext }































  // 63da28e007307e03e8c77ad9



// import React, { useEffect, useState, createContext } from 'react'
// import List from './List'
// import "./style.css"
// import Modal from './Modal'
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const mycontext = createContext();


// const App = () => {

//   const [data, setData] = useState({
//     task: "",
//     status: "Incomplete",
//     time: "",
//     id: "",
//     complete: false
//   });

//   const [item, setItem] = useState(JSON.parse(localStorage.getItem("taskData")) || []);
//   const [update, setUpdate] = useState(false);
//   const [edited, editedData] = useState(null);
//   const [showData, setshowData] = useState("All");
//   const [printData, setprintData] = useState([]);
//   const [mymodal, setModal] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("taskData", JSON.stringify(item));
//   }, [item]);

//   useEffect(() => {
//     setprintData(item.filter((val) => {
//       if (showData == "All") return val;
//       else return val.status == showData;
//     }))
//   }, [showData, item]);

//   const changeHandle = (e) => {
//     let name = e.target.name;
//     let val = e.target.value;
//     setData({ ...data, [name]: val });
//   }

//   const addSuccess = () => toast.success('Task Added Successfully !', {
//     position: toast.POSITION.BOTTOM_RIGHT
//   });
//   const editSuccess = () => toast.success('Task Update Successfully !', {
//     position: toast.POSITION.BOTTOM_RIGHT
//   });
//   const deleteSuccess = () => toast.success('Task Delete Successfully !', {
//     position: toast.POSITION.BOTTOM_RIGHT
//   });
//   const addFail = () => toast.error('Please enter a Title', {
//     position: toast.POSITION.BOTTOM_RIGHT
//   });

//   const addTask = () => {
//     if (data.task == "" || data.status == "") {
//       addFail();
//     }
//     else if (update == true) {
//       setModal(false);
//       setItem(
//         item.map((val) => {
//           if (val.id == edited.id) {
//             data.complete = (data.status == "Incomplete") ? false : true;
//             return data;
//           }
//           return val;
//         })
//       );
//       setUpdate(false);
//       editedData(null);
//       setData({
//         task: "",
//         status: "Incomplete",
//         time: "",
//         id: "",
//         complete: false
//       });
//       editSuccess();

//     }
//     else {
//       // setModal(false);
//       let taskTime = new Date();
//       let fulltime = taskTime.toLocaleTimeString();
//       let fullDate = taskTime.toLocaleDateString();
//       let TaskTotTime = `${fulltime}, ${fullDate}`;

//       data.time = TaskTotTime;

//       data.id = new Date().getTime();
//       data.complete = (data.status == "Incomplete") ? false : true;
//       setItem([...item, data]);
//       setData({
//         task: "",
//         status: "Incomplete",
//         time: "",
//         id: "",
//         complete: false
//       });
//       addSuccess();
//     }

//   }

//   const deleteItem = (id) => {
//     let notdel = item.filter((val) => val.id != id);
//     setItem(notdel);
//     deleteSuccess();
//   }

//   const updateItem = (id, data) => {
//     let upData = item.find((val) => val.id == id);

//     setUpdate(true);
//     setModal(true);
//     editedData(upData);
//     setData({
//       task: upData.task,
//       status: upData.status,
//       time: data.time,
//       id: data.id,
//       complete: (upData.status == "Incomplete") ? false : true
//     });
//   }

//   const chachboxHandle = (checked, id) => {
//     let check = checked;
//     let checkitem = item.find((val) => {
//       return val.id == id;
//     });
//     checkitem.complete = check;
//     checkitem.status = (check == true) ? "Complete" : "Incomplete";
//     setItem(
//       item.map((val) => {
//         if (val.id == checkitem.id) {
//           return checkitem;
//         }
//         return val;

//       })
//     );
//   }

//   return (
//     <>
//       <ToastContainer
//         position="bottom-right"
//         autoClose={1000}
//         hideProgressBar
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable={false}
//         pauseOnHover={false}
//         theme="light"
//       />
//       <div className='container'>
//         <h1 className='text-center mt-3 todo-title'>User LIST</h1>
//         <div className="row mt-4">
//           <div className="col-8 mx-auto">
//             <div className="d-flex justify-content-between">
//               <button type="button" className="btn btn-add px-4" data-bs-toggle="modal" data-bs-target="#myModal" onClick={() => setModal(false)}>
//                 Add User
//               </button>

//               {/* <select name="cars" id="filter" className='px-3 py-2' onChange={({ target: { value } }) => setshowData(value)}>
//                 <option value="All">All</option>
//                 <option value="Incomplete">Incomplete</option>
//                 <option value="Complete">Complete</option>
//               </select> */}

//             </div>
//           </div>
//           <div className="col-8 mx-auto">
//             <div className="row mt-3 task-outer pb-3">

//               {printData && printData.length > 0 ?
//                 printData.map((data, index) => {
//                   return (
//                     <>
//                       <div className="col-12 px-3 pt-3" key={index}>

//                         <List data={data} deleteItem={deleteItem} updateItem={updateItem} chachboxHandle={chachboxHandle} />
//                       </div>
//                     </>
//                   )
//                 }) : <div className='text-center my-auto'>"No Data Found"</div>

//               }

//             </div>
//           </div>
//         </div>
//       </div>

//       <mycontext.Provider value={[update, mymodal, data, setData]}>
//         <Modal key={1} changeHandle={changeHandle} addTask={addTask} />
//       </mycontext.Provider >

//     </>
//   )
// }

// export default App
// export { mycontext }