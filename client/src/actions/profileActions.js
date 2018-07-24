import axios from'axios';
import {GET_PROFILE,PROFILE_LOADING,GET_ERRORS,CLEAR_CURRENT_PROFILE} from './Types';
//GET CURRENT PROFILE
export const getCurrentProfile=()=>dispatch=>{
dispatch(setProfileLoading());
axios.get('/api/profile')
.then(res=>dispatch({
    type:GET_PROFILE,
    payload:res.data
})
)
.catch(err=>dispatch({
    type:GET_PROFILE,
    payload:{}
}))
}
// Clear Profile
export const clearCurrentProfile=()=>{
    return{
        type:CLEAR_CURRENT_PROFILE
    };
};
//create profile
export const createProfile=(profileData,history)=>dispatch=>{
    axios.post('/api/profile', profileData)
    .then(res=>history.push('/dashboard'))
    .catch(err=>
    dispatch({
        type:GET_ERRORS,
        payload:err.response.data
    }));
}

// Profile Loading
export const setProfileLoading=()=>{
    return{
        type:PROFILE_LOADING
    }
}