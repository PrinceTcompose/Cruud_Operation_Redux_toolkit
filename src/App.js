import React, { useEffect, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"
import Modal from './Modal';
import List from './List';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosAPICall } from './utils';
// import { FlapperSpinner } from 'react-spinners-kit';
import ClipLoader from 'react-spinners/ClipLoader';
import { WhisperSpinner } from 'react-spinners-kit';

const mycontext = createContext();

const App = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    date_of_birth: "",
    address: ""
  });

  const [user, setUser] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editedItem, seteditedItem] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    try {
      const respone = axiosAPICall('users', 'get');

      respone.then((result) => {
        setUser(result);
        setLoading(false);
      });

    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  // console.log("Local Data ==> ", user);

  const onAdduserFun = () => {
    setEdit(false);
    setFormData({
      name: "",
      email: "",
      contact_no: "",
      date_of_birth: "",
      address: ""
    });
    seteditedItem(null);
  }

  const setApiData = async () => {
    const editedDataObj = {
      name: formData.name,
      email: formData.email,
      contact_no: formData.contact_no,
      date_of_birth: formData.date_of_birth,
      address: formData.address
    };
    const respone = await axiosAPICall('users', 'post', editedDataObj);

    console.log("Add Data ==> ", respone);

    setUser(prev => [...prev, respone]);
  }

  const setEditApiData = (id) => {
    const editedDataObj = {
      name: formData.name,
      email: formData.email,
      contact_no: formData.contact_no,
      date_of_birth: formData.date_of_birth,
      address: formData.address
    };

    const respone = axiosAPICall(`users/${id}`, 'put', editedDataObj);
    console.log('Edit respone :>> ', respone);

    respone.then((result) => {
      (result === "") && setUser(user.map((detail) => {
        if (detail._id === id) return editedDataObj
        return detail;
      }));
    });

  }




  const getData = (e) => {
    e.preventDefault();
    if (formData.name === "" || formData.email === "" || formData.contact_no === "" || formData.date_of_birth === "" || formData.address === "" || mobileError !== "") {
      // alert("Please Fill All the Data");
      toast.error('Please Fill All Data !', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (edit && (formData.name !== "" && formData.email !== "" && formData.contact_no !== "" && formData.date_of_birth !== "" && formData.address !== "" && mobileError === "")) {
      // setUser(user.map((val) => {
      //   if (val._id === editedItem._id) return formData;
      //   return val;
      // }))       
      let email = user.find((val) => {
        return formData.email !== editedEmail && val.email === formData.email;
      });
      if (!email) {
        setEditApiData(editedItem._id);

        setEdit(false);
        seteditedItem(null);
        setFormData({
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
      // setUser([...user, formData]);
      let email = user.find((val) => {
        return val.email === formData.email;
      });

      if (!email) {

        setApiData();

        setFormData({
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


  const setDelApiData = async (id) => {
    const respone = axiosAPICall(`users/${id}`, 'delete');
    console.log('Delete respone :>> ', respone);

    respone.then((result) => {
      (result === "") && setUser(user.filter((detail) => {
        return detail._id !== id;
      }));
    });


  }
  const deleteItem = (id) => {
    // setUser(user.filter((val) => val._id !==id));
    setDelApiData(id);

    toast.error('Task Deleted Successfully !', {
      position: toast.POSITION.TOP_RIGHT
    });

  }


  const handleChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    setFormData({ ...formData, [name]: val })
  }

  const updateItem = (id) => {
    setEdit(true);
    let mydata = user.find((val) => {
      return val._id === id;
    })
    seteditedItem(mydata);
    setEditedEmail(mydata.email);

    setFormData({
      name: mydata.name,
      email: mydata.email,
      contact_no: mydata.contact_no,
      date_of_birth: mydata.date_of_birth,
      address: mydata.address
    });
  }


  const validateMobile = () => {
    if (formData.contact_no.length !== 10 || isNaN(formData.contact_no)) {
      setMobileError("Please Enter 10 Digit Number")
    }
  }

  return (
    <>


      {/* {(loading) ? <FlapperSpinner size={30} color="#686769" loading={loading} /> : null} */}

      {/* {(loading) ? <div style={{ width: '100wh', height: "100vh", margin: 'auto', display: 'block', background: "lightgray", text: "center" }}>
        <ClipLoader color="#52bfd9" size={100} />
      </div> : */}
      {(loading) ? <div className="text-center mx-auto" style={{ height: "100vh", width: "100wh" }}>
        <WhisperSpinner size={100} className="" color="#585858" />
      </div> :
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
                    (user.length > 0) && user.map((val, ind) => {
                      return (
                        <List key={ind} val={val} deleteItem={deleteItem} updateItem={updateItem} />
                      )
                    })
                  }
                </tbody>
              </table>
              {!user.length > 0 && <div className='mt-2 text-center w-100'>No Data Found</div>}
            </div>

            <mycontext.Provider value={[formData, edit, setEdit, mobileError, setMobileError]}>
              <Modal handleChange={handleChange} getData={getData} onAdduserFun={onAdduserFun} validateMobile={validateMobile} />
            </mycontext.Provider>
          </div >
        </>
      }
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

//   const [formData, setFormData] = useState(JSON.parse(localStorage.getItem("taskData")) || []);
//   const [update, setUpdate] = useState(false);
//   const [edited, editedData] = useState(null);
//   const [showData, setshowData] = useState("All");
//   const [printData, setprintData] = useState([]);
//   const [mymodal, setModal] = useState(false);

//   useEffect(() => {
//     localStorage.setFormData("taskData", JSON.stringify(formData));
//   }, [formData]);

//   useEffect(() => {
//     setprintData(formData.filter((val) => {
//       if (showData === "All") return val;
//       else return val.status === showData;
//     }))
//   }, [showData, formData]);

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
//     if (data.task === "" || data.status === "") {
//       addFail();
//     }
//     else if (update === true) {
//       setModal(false);
//       setFormData(
//         formData.map((val) => {
//           if (val.id === edited.id) {
//             data.complete = (data.status === "Incomplete") ? false : true;
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
//       data.complete = (data.status === "Incomplete") ? false : true;
//       setFormData([...formData, data]);
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
//     let notdel = formData.filter((val) => val.id !==id);
//     setFormData(notdel);
//     deleteSuccess();
//   }

//   const updateItem = (id, data) => {
//     let upData = formData.find((val) => val.id === id);

//     setUpdate(true);
//     setModal(true);
//     editedData(upData);
//     setData({
//       task: upData.task,
//       status: upData.status,
//       time: data.time,
//       id: data.id,
//       complete: (upData.status === "Incomplete") ? false : true
//     });
//   }

//   const chachboxHandle = (checked, id) => {
//     let check = checked;
//     let checkitem = formData.find((val) => {
//       return val.id === id;
//     });
//     checkitem.complete = check;
//     checkitem.status = (check === true) ? "Complete" : "Incomplete";
//     setFormData(
//       formData.map((val) => {
//         if (val.id === checkitem.id) {
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