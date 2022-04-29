/*
    CS 4920 Senior Project - Spring 2022
    Charter and Go Project - Flight Risk Assessment Tool
    Instructor: Taeghyun Kang
    Team: LAW.DAT
        Tyler Anderson
        De-Shian Lin
        Jacob Nicholson
        Aaron Westhoff

    Page Description:
    This page hosts all functions used to make our CRUD API calls.
*/

import axios from 'axios'

// This is the URL endpoint through AWS API Gateway.
const url = 'https://5r839sju3l.execute-api.us-east-1.amazonaws.com/test/'

// This function is used for GET API calls. Whether it pulls information from all submission in the database or
// one specific entry is determined by the JSON passed to it.
export async function get(data) {
    return await axios.post(url, data)
          .then((response) => {
              return response.data.body
          })
          .catch((error) => {
              console.log(error)
          })
}

// This function is used for POST API calls. The 'data' parameter is a JSON object used to specify details of the API Call,
// including the object to be submitted to the database through the API call.
export async function postOne(data) {

    // Before making the POST call, we check if the trip number being submitted is already in the database.
    const exists = await check(data.body.header.tripNum)

    // If the trip number is not in the database, we proceed with the API call.
    // We used exists == false instead of !exists due to issues with logic handling.
    if(exists == false) {
        const result = await axios.post(url, data)
        .then((response) => {
                return response.data
        })
        .catch((error) => {
            console.log(error)
        })

        // If the API call was successfully made, we return 'false' to the caller (used for error messages in App.js)
        return false
    }
        // If the API call was NOT successfully made, we return 'true' to the caller (used for error messages in App.js)
    else
        return true
}

// We created this function to be used during testing, in order to delete all entries in the database in one action.
export async function clearDB() {
    return await axios.post(url, {
            "params":{
                "httpMethod": "DELETE",
                "amount": "ALL"
            }
        }
    )
}

// This function is used to check if a trip number currently exists in the database.
export async function check(tripNum) {

    // Create JSON to use for GET API call (to see if trip number exists)
    const checkData = {
        "params": {
            "httpMethod": "GET",
            "amount": "ONE",
            "key": tripNum
        }
    }

    // Store result of GET call in 'result' variable.
    const result = await axios.post(url, checkData)
    .then((response) => {
        return response.data.body
    })
    .catch((error) => {
        console.log(error)
    })

    // If the API call returned a 'null' object, the trip number is not in use, and 'false' is returned to the caller
    if(result == null)
        return false
    // If the above is not triggered, the trip number DOES currently exist in the database, and 'true' is returned to the caller.
    else
        return true
}

// This function is used to make a PATCH API call for updating existing entries in the database. The 'data' parameter being passed
// is a JSON object of the form values to be sent.
export async function patch(data) {

    // We build a JSON object to be used by the API, passing components of the 'data' parameter into it.
    const json_data = {
        "params": {
            "httpMethod": "PATCH",
            "key": data.header.tripNum,
            "updatedFields": {
                "header": data.header,
                "sections": data.sections
            }}}
    
    // We make the API call using the above JSON object and return the result of the API call to the caller.
    const result = await axios.post(url, json_data)
    .then((response) => {
        return response.data.body
    })
    .catch((error) => {
        console.log(error)
    })
    return result
}

export default get