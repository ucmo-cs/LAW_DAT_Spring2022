import React, { useState, useEffect } from "react"
import {get, patch} from '../crud' 
import { useLocation } from "react-router-dom"
import Detail_Header from "./Detail_Header"
import Detail_Section from "./Detail_Section"

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
    This page displays all elements for the edit page of the application. Similar functionality to App.js
*/

export default function Detail_App () {
    
    //usses useLocation hook to get JSON
    const location = useLocation()
    //sets data from JSON to a variable
    const json_data = location.state

    //states used by the page
    const [body, setBody] = useState()
    const [state, setState] = useState()
    const [loaded, setLoaded] = useState(false)
    const [error, setErrors] = useState([])
    const [success, setSuccess] = useState()
    const [status, setStatus] = useState()
    const [total, setTotal] = useState()

   // values array is declared empty so it is not rediclared each time in the loop
    var values = []

    // This function serves two purposes:
    // First, it uses the state prop passed to the object to make a GET API request when the page loads.
    // To ensure repeated requests aren't made, a 'loaded' state exists which indicates if the API call has
    // already been performed.
    // Second, this handles error messages when the 'body' state is changed, which is performed only when the
    // submit button is pressed. Since we only want to monitor changes to 'body' state, it is the only state passed
    // as a parameter
    useEffect(async () => {
        if(body)
            setErrorMessage(["This trip number is already in use!"])
        if(!loaded) {
            const result = await get(json_data)
            await setState(result)
            await setTotal(result.header.totalRisk)
            setLoaded(true)
        }
        if(loaded) {
            state.sections.map(section => 
                section.contents.map(line => 
                    values[line.lineNumber] = line.input
                ))
        }
        // change the icons and shadow color base on the risk number
        if(total < 20) {
            setStatus("🟢")
            document.getElementById('navbar').style.boxShadow = "0 0 8px rgba(0, 210, 106)"
        } 
        else if(total < 25) {
            setStatus("🔶")
            document.getElementById('navbar').style.boxShadow = "0 0 8px rgba(255, 130, 45)"
        }
        else if(total >= 25) {
            setStatus("🛑")
            document.getElementById('navbar').style.boxShadow = "0 0 8px rgba(248, 49, 47)"
        }
    }, [body, loaded, total])


    // This function receives new input values from it's child component and saves the input
    // in an array index corresponding to the line number.
    const handler = (prevState, newState, id) => {
        if(isNaN(prevState))
          prevState = 0
        if(isNaN(newState))
          newState = 0
        var x = total
        x -= prevState
        x += newState
        setTotal(x)
        values[id] = newState
    }

    // This function is used to build the JSON object used in the API call when the submit button is pressed.
    // Section & form totals are recalculated here to ensure the data being put in the JSON is correct.
    const onSubmit = async () => {
        var formTotal = 0
        var line_idx = 1
        state.sections.map(section => {
            var sectionSum = 0
            section.contents.map(line => {
                line.input = values[line_idx]
                sectionSum += values[line_idx]
                formTotal += values[line_idx]
                line_idx += 1
            })
            section.sectionTotal = sectionSum
        })

        var date = new Date(document.getElementById("date").value)
        state.header.date = date.toString()
        state.header.departure = document.getElementById("departure").value
        state.header.destination = document.getElementById("destination").value
        state.header.tripNum = state.header.tripNum
        state.header.tailNum = document.getElementById("tail").value
        state.header.totalRisk = formTotal
        
        submit(state)
    }

    // This function is meant to temporarily set error messages to display for 5 seconds, with
    // the error messages being passed as a parameter of a string array.
    const setErrorMessage = (message) => {
        setErrors(message)
        setTimeout(() => {
            setErrors([])
        }, 5000)
    } // for the red color text message

    const setSuccessMessage = () => {
        setErrors([])
        setSuccess("Update successfully submitted to database!")
        setTimeout(() => {
            setSuccess()
        }, 5000)
    } // for the green color text message


    // This is a function to check the header fields when the submit button is pressed.
    // For each empty header field, a corresponding error message will be displayed below
    // the submit button. If all header fields are filled, it will indicate to it's caller
    // that the form is prepared for the API call.
    const checkNullHeaders = () => {
        var errors = []
        var count = 0
        if(state.header.departure[1] == null) {
            errors.push("Departure field cannot be empty!")
            count++
        }
        if(state.header.destination[1] == null) {
            errors.push("Destination field cannot be empty!")
            count++
        }
        if(state.header.tripNum[1] == null) {
            errors.push("Trip Number field cannot be empty!")
            count++
        }
        if(state.header.tailNum[1] == null) {
            errors.push("Tail Number field cannot be empty!")
            count++
        }
        setErrorMessage(errors)
        if(count > 0)
            return false
        else   
            return true
    }

    // This is a small function triggered after the JSON is built on form submission.
    // It's primary purpose is to check for empty Header fields and perform the API call.
    // If the form is properly submitted, it should redirect to the detail page of the submitted form (NOT YET IMPLEMENTED).
    const submit = async (data) => {
        if(checkNullHeaders()) {
            const result = await patch(data)
            setSuccessMessage()              
    }
}
    
    //page that renders if the page is loaded
    if(loaded)
        return (
            <div className="form-main-frame">
            <div id= "sec1">
                {/* the title on for the edit page */}
                <div className="trip-title-info">
                    <span><b># Trip Number</b> {state.header.tripNum}</span>
                    {/* risk number with icon in the back */}
                    <div className="trip-status">
                        {/*displays status of the flight for this form*/}
                        {status}
                        {/* displays total of the form*/}
                        <span className="trip-risk-number">
                            <span className="trip-risk-text">RISK<br/></span>
                            {total}
                        </span>
                    </div>
                </div>

                {/*Displays header for the page by passing data to Detial_Header.js */}
                <Detail_Header data={state.header}/>

                {/*Displays sections of the form */}
                {state.sections.map(section => (
                    <Detail_Section key={section.title} name={section.title} handler={handler} total={section.sectionTotal} contents={section.contents} />
                ))}   
            </div>
            
            {/*update button to resubmit the form */}
            <div className="submit-button-div">
                <button onClick={() => onSubmit()}>
                   <b>🞲 &nbsp;UPDATE&nbsp; 🞲</b>
                </button>
            </div>
            <br/>
            {/*Displays error message */}
            <div className="error-message">
                {error.map(error => (
                    <div><b>{error}</b></div>
                ))}
            </div>

            {/*Displays success message */}
            <div className="success-message">
                <b>{success}</b>
            </div>
        </div> 
        )
    {/*Messgae that displays when the page has not loaded */}
    return <div>Loading...</div>
}