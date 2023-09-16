import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { addEventApi } from "../Redux/actions";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


axios.defaults.withCredentials = true

//schema to validate event inputs 
const schema = yup.object({
  title: yup.string().required("Can't Be Empty"),
  start: yup.date().required("Please specify the time to start"),
}).required();



const AddEvents = ({addEventApi, error, modalonsubmit}) => {

  const [repeatOption, setRepeatOption] = useState("repeat");

  const handleRepeatOptionChange = (event) => {
    setRepeatOption(event.target.value);
  };
  
  const [user, setUser] = useState(null);
  const [emailid, setEmailid] = useState("");

	const getUser = async () => {
		try {
			const url = "https://classcraftbackend.onrender.com/auth/login/success";
			const { data } = await axios.get(url, { withCredentials: true ,crossDomain: true  });
			setUser(data.user._json);
      setEmailid(data.user._json.email);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);
console.log(emailid);

     const navigate = useNavigate()
     const [rerender, setRerender] = useState(false);
     const [dbError, setError] = useState(false)
     const [firstRender, setFirstRender] = useState(true)
     
 

     useEffect( ()=>{
      if(error && !firstRender){
        setError(error)
        
      }
        if(!error.start && !error.end && dbError !== false){
          setTimeout(navigate("/")) 
        }
     }, [rerender])
    //using form-hook to register event data
    const { register, handleSubmit, formState: {errors}, control } = useForm({
      resolver: yupResolver(schema)
    });
   
     const onSubmit = async(values)=>{
      setFirstRender(false)
        addEventApi(values)
        .then(()=>{
        setRerender(!rerender);
        modalonsubmit();
        })
        
       }

  if(user!=null)
  return (
    //this form is in bootstrab
    <form onSubmit={handleSubmit(onSubmit)} className=" align-content-center m-5">
    <div className="mb-4">
      <label htmlFor="title" className="form-label">Course Name</label>
      <input {...register("title")}  type="text" placeholder="title" className="form-control" id="title" aria-describedby="title" />
      <p className={`error text-warning position-absolute ${errors.title?"active":""}`}>{errors.title?<i className="bi bi-info-circle me-2"></i>:""}{errors.title?.message}</p>
    </div>
    <div className="mb-4" style={{zIndex: "100"}}>
      <label htmlFor="start" className="form-label">Start Time</label>
      {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
      {/* start date controller*/}
      <Controller
      control={control}
      name="start"
      render={({ field }) => (
        <DatePicker
          placeholderText="Select start time"
          onChange={(date) => field.onChange(date)}
          selected={field.value}
          value={field.value}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="form-control"
          id="start"
        />
      )}
    />
    {/* error handling */}
    <p className={`error text-warning position-absolute ${errors.start?"active":""}`}>{errors.start?<i className=" bi bi-info-circle me-2"></i>:""}{errors.start?.message}</p>
    <p className={`error text-warning position-absolute ${dbError.start?"":"d-none"}`}>{dbError.start?<i className=" bi bi-info-circle me-2"></i>:""}{dbError.start}</p>
    </div>
    <div className="mb-4" style={{zIndex: "100"}}>
      <label htmlFor="end" className="form-label">End Time</label>
      {/* end date controller*/}
      <Controller
    control={control}
    name="end"
    render={({ field }) => (
      <DatePicker
        placeholderText="Select end time"
        onChange={(date) => field.onChange(date)}
        selected={field.value}
        value={field.value}
        timeFormat="HH:mm"
        dateFormat="MMMM d, yyyy h:mm aa"
        showTimeSelect
        className="form-control"
        id="end"
        
      />
    )}
  />
    <p className={`error text-warning position-absolute ${dbError.end?"":"d-none"}`}>{dbError.end?<i className=" bi bi-info-circle me-2"></i>:""}{dbError.end}</p>
    </div>
    <div className="mb-4">
      <label htmlFor="describe" className="form-label">
        Course Description <span className="text-danger small">(optional)</span>
      </label>
      <input {...register("describe")}  type="text" placeholder="describe your event" className="form-control" id="describe" aria-describedby="describe" />
    </div>
    <div className="mb-4">
      <input {...register("emailid")}  id="postId" name="postId" value={user.email} type="hidden"  />
    </div>
    <div className="mb-4 d-flex align-items-center">
        <label htmlFor="repeatOption" className="form-label">
          Repeat Option : &nbsp;
        </label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="repeatOption"
            id="repeat"
            value="repeat"
            checked={repeatOption === "repeat"}
            onChange={handleRepeatOptionChange}
          />
          <label className="form-check-label" htmlFor="repeat">
            Repeat &nbsp;
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="repeatOption"
            id="noRepeat"
            value="noRepeat"
            checked={repeatOption === "noRepeat"}
            onChange={handleRepeatOptionChange}
          />
          <label className="form-check-label" htmlFor="noRepeat">
            No Repeat
          </label>
        </div>
      </div>
      {repeatOption === "repeat" && (
        <div className="mb-4" style={{ zIndex: "100" }}>
          <label htmlFor="repeatUntil" className="form-label">
            Repeat until:
          </label>
          {/* Repeat until date controller */}
          <Controller
            control={control}
            name="repeatUntil"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                value={field.value}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
                id="repeatUntil"
              />
            )}
          />
          <p className={`error text-warning position-absolute ${errors.repeatUntil ? "active" : ""}`}>
            {errors.repeatUntil ? <i className=" bi bi-info-circle me-2"></i> : ""}
            {errors.repeatUntil?.message}
          </p>
        </div>
      )}
    <button type="submit" className="btn btn-success">Create</button>
  </form>
  )
  else return (
    <div className="
    "></div>
  )
}


function mapStateToProps({event, error}){
  return{
    error
    // event
  }
}


export default connect(mapStateToProps , {addEventApi})(AddEvents)