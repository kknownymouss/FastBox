// Base API URL for requests
export const API_URL = ""

// return the user data from the session storage
export const getAccessToken = () => {
    return sessionStorage.getItem('access_token') || null
}

// return activity token
export const getActivityToken = () => {
    return sessionStorage.getItem('activity_token') || null
}


// set the token and user from the session storage
export const setAccessToken = (access_token) => {
    sessionStorage.setItem('access_token', access_token);
}

// set the activity token
export const setActivityToken = (activity_token) => {
    sessionStorage.setItem('activity_token', activity_token);
}


// checks if the user is authenticated and returns a boolean
export const isAuth = () => {
    return (getAccessToken() && getActivityToken() ? true : false)
}