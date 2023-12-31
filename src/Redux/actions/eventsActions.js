import { event } from "../Axios/event"
import * as moment from "moment"
import { addError, removeError } from "./errorsAction"
import axios from "axios"


export const showEvent = (event)=>{
    console.log("event to be shown on the modal: ", event)
    return{
        type: "SHOW_EVENT",
        payload: event
    }
}

export const showEvents = (events)=>{
    
    return{
        type: "SHOW_EVENTS",
        payload: events
    }
}

export const ShowEventApi = id => async dispatch => {
     
    //i won't get the event from redux store as it is safer to
    //keep updated with db.
    const result = await event.get(`/${id}/show`);
    try{
        const {title, _id, start, end, describe} = await result.data;
        const convertedEvent = {
            title,
            describe,
            id: _id,
            start: moment(start).format("ddd DD MMM YY LT"),
            end: moment(end).format("ddd DD MMM YY LT")
        }
        await dispatch(showEvent(convertedEvent));
    }catch(err){
         const error =await err.data.message;
         return error
    }
}

export const ShowEventsApi = () => async dispatch => {
     console.log("started fetching the api")
    //i won't get the event from redux store as it is safer to
    //keep updated with db.
    const result = await event.get("/");
    const url = "https://classcraftbackend.onrender.com/auth/login/success";
    const courseUrl = "https://classcraftbackend.onrender.com/api/studentcourses/getcourse";
    const { data } = await axios.get(url, { withCredentials: true });
    const courseobj = await axios.get(courseUrl);
    const dataArray = courseobj.data;
    // console.log(courseobj.data);
    
    const useremail = data.user._json.email;
    try{
        const convertedDates = await result.data.map(event=>{
            if(event.emailid===useremail || dataArray.some(obj => obj.emailid === useremail && obj.title === event.title))
            {
                return{
                    title: event.title,
                    start: new Date(event.start) ,
                    end: new Date(event.end) ,
                    id: event._id,
                    describe: event.describe
                  }
            }
            else return null;
          })
        await dispatch(showEvents(convertedDates))
    }catch(err){
         const error =await err.data.message;
         return error
    }
}


export const ShowAllEventsApi = () => async dispatch => {
    console.log("started fetching the api")
   //i won't get the event from redux store as it is safer to
   //keep updated with db.
   const result = await event.get("/");
   try{
       const convertedDates = await result.data.map(event=>{
               return{
                   title: event.title,
                   start: new Date(event.start) ,
                   end: new Date(event.end) ,
                   id: event._id,
                   describe: event.describe
                 }
         })
         return convertedDates;
   }catch(err){
        const error =await err.data.message;
        return error
   }
}


export const deleteEvent = (id)=>{
   return {
       type: "DELETE_EVENT",
       payload: id
   }
}

export const deleteEventApi = (id) =>  async dispatch=> {
    const result = await event.delete(`/${id}/delete`)

    try {
        const deleted = await result.data;
        await dispatch(deleteEvent(id))
        return {deleted}
    }catch(err){
        const message = await result.data.message;
        console.log(message)
        return {message}
    }
}



const addEvent = (newEvent)=>{
    return{
      type: "ADD_EVENT",
      payload: newEvent
    }
}


export const addEventApi = (values) => async dispatch =>{
    console.log(values);
    if(typeof values.repeatUntil == 'undefined')
      values.repeatUntil = values.start;
    var startdate = moment(values.start);
    var enddate = moment(values.end);
    while(startdate <= moment(values.repeatUntil))
    {
        await event.post("/", {
            title: values.title,
            start: startdate,
            end: enddate,
            describe: values.describe,
            emailid : values.emailid
        })
        .then(res=>{
        
        if(res && res.data){
            console.log("event from the api going to the reducer: ", res.data)
            dispatch(addEvent(res.data)) 
            dispatch(removeError())
            
            return  "success";
        }
        })
        .catch(res=>{
            console.log("catch response, ", res)
            if(res.response.data){
                
                console.log(res.response.data)
                dispatch(addError(res.response.data));
            }
        })
        startdate.add(7,'d');
        enddate.add(7,'d');  
    }
}

// const updateEvent = (updatedEvent)=>{
//     return{
//       type: "UPDATE_EVENT",
//       payload: updatedEvent
//     }
// }

export const updateEventApi = (values, id) => async dispatch =>{
    try{
        const result = await event.put(`/${id}/update`, {
            title: values.title,
            start: values.start,
            end: values.end,
            describe: values.describe
          })
         console.log(result)
        //   const response = result.data;
          dispatch(removeError())
          return "response was successful";
    }catch(err){
        console.log(err)
        dispatch(addError(err.response.data));
    }
}