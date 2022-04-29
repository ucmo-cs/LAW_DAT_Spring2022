import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Section from "./components/Section"
import Format from './standardPost'
import {postOne} from './crud' 
import Header from "./components/Header"
import { useNavigate } from "react-router-dom"
import './css/app.css'

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
    This page is the primary component used to display a New Form submission page.
    It's child components in this project are 'Header.js' and multiple 'Section.js'.
*/


export default function App(props) {

    // State variables used to update the page render when changed
    const [error, setErrors] = useState([])    // For displaying specific error messages
    const [body, setBody] = useState()         // Used for determining if error messages need to be set
    const [total, setTotal] = useState(0)      // Used to display the total risk value of the form

    // useNavigate() is used to invoke conditional page navigation (e.g. when a form is successfully submitted)
    const navigate = useNavigate()

    //  Other variables
    var format = Format    // This pulls our standard POST JSON from a local file, so we can edit it with form inputs and submit it later
    var values = []        // This array holds the values for each individual line input, used to update the POST JSON on form submission
    
    // This function receives new input values from it's child component and saves the input
    // in an array index corresponding to the line number.
    const handler = (prevState, newState, id) => {

        // If the child component passes a null value for the selection, we replace it with 0 (used to mitigate potential errors)
        if(isNaN(prevState))
          prevState = 0
        if(isNaN(newState))
          newState = 0
        
        // We take the current form total, subtract the previous input value from it, and then add the new input value.
        var x = total
        x -= prevState     // This would be the previous input value
        x += newState      // This would be the new input value
        setTotal(x)        // Update the 'total' state with the new calculated value

        // We store the line's input value in an array index corresponding to the line number (used for form submission)
        values[id] = newState
    }

    // This function is used to build the JSON object used in the API call, and make the API call if conditions are met
    const onSubmit = async () => {

        // Variables to track total risk value and iterate through our values array
        var formTotal = 0
        var line_idx = 1

        // Grab values from header fields (Date will use a timestamp of when the submission is made)
        format.body.header.date = Date(Date.now())
        format.body.header.departure = document.getElementById("departure").value
        format.body.header.destination = document.getElementById("destination").value
        format.body.header.tripNum = document.getElementById("trip").value
        format.body.header.tailNum = document.getElementById("tail").value

        // Loop through each section in the body of the JSON
        format.body.sections.map(section => {

            // Variable to calculate section total
            var sectionSum = 0

            // Inside each section, loop through each individual line/component to update it's input value
            section.contents.map(line => {
                    line.input = values[line_idx]
                    sectionSum += values[line_idx]
                    formTotal += values[line_idx]

                // Iterate to the next line (tracked across sections)
                line_idx += 1
            })

            // When done looping through the section, we insert the calculated section total into the JSON
            section.sectionTotal = sectionSum
        })

        // When all sections have been completed, we update the form total in the JSON
        format.body.header.totalRisk = formTotal

        // Check if all header fields have been filled. If true, continue. If not, displays error messages
        if(checkNullHeaders()) {

            // Here we make our API call and store the response from the attempt in the 'body' state
            var api_response = await postOne(format)
            setBody(api_response)

            // The API call returns 'false' if the trip number is not currently used and a successful submission to
            // the database is made. In this scenario, we want to navage to the edit page of the submission just made.
            // the 'state' JSON used in the navigate() parameter is the JSON used for the GET API call to pull the submission
            // details.
            if(!api_response) {
                navigate('/detail', {state: {
                    "params": {
                        "httpMethod": "GET",
                        "amount": "ONE",
                        "key": format.body.header.tripNum
                    }
                }})
            }                       
        }
    }

    // This function is meant to temporarily set error messages to display for 5 seconds, with
    // the error messages being passed as a parameter of a string array.
    const setErrorMessage = (message) => {
        setErrors(message)
        setTimeout(() => {
            setErrors([])
        }, 5000)
    }


    // This function is used to check the header input fields and return error messages if they are not filled.
    const checkNullHeaders = () => {
        
        // Variables to hold error messages (so multiple messages can be displayed at once) and how many errors are found
        var errors = []
        var count = 0

        // Checking each header field and inserting a corresponding error message to be displayed if the field is empty
        if(format.body.header.departure[1] == null) {
            errors.push("Departure field cannot be empty!")
            count++
        }
        if(format.body.header.destination[1] == null) {
            errors.push("Destination field cannot be empty!")
            count++
        }
        if(format.body.header.tripNum[1] == null) {
            errors.push("Trip Number field cannot be empty!")
            count++
        }
        if(format.body.header.tailNum[1] == null) {
            errors.push("Tail Number field cannot be empty!")
            count++
        }

        // Set the 'errors' state to the array of error messages found while checking
        setErrorMessage(errors)

        // If any errors are found, we return 'false' to the caller (used to determine whether to make the API call)
        if(count > 0)
            return false
        else   
            return true
    }

    // useEffect() is used to monitor changes to the 'body' state (for error message handling) and reset
    // the navbar shadow coloring when switching pages.
    useEffect(() => {

        // The function to make the API call returns 'true' if the trip number being submitted is already in the database.
        // In this event, an error message is displayed to inform the user that they must use another trip number.
        if(body)
            setErrorMessage(["This trip number is already in use!"])

        // This is used to reset the navbar shadow color when loading the page.
        document.getElementById('navbar').style.boxShadow = "0 0 8px rgba(0, 0, 0, .3)"
    }, [body])

    // This section defines what is rendered on the page by the component
    return (

        // This div is used to build a frame that the form fits inside of
        <div className="form-main-frame">

            {/* This div is used to style & frame the main components of the page (Header and Section inputs) */}
            <div id= "sec1">

                {/* Render a Header component at the top (no props necessary) */}
                <Header/>   

                {/* For each section in our POST JSON, we render a Section component. For props, key is the title of the section,
                handler is used to pass input values to this parent component, and contents holds all individual lines that
                are a part of the section. */}
                {format.body.sections.map(section => (
                    <Section key={section.title} name={section.title} handler={handler} contents={section.contents} />
                ))}   
            </div>
            
            {/* This div is used to style the Submit button */}
            <div className="submit-button-div">
                <button onClick={() => onSubmit()}>
                    《 <b>&nbsp;SUBMIT&nbsp;</b> 》
                </button>
            </div>

            {/* Below the Submit button, we have a section for displaying error messages when needed */}
            <br/>
            <div className="error-message">

                {/* Since the number of error messages is not static, we loop through all the generated error messages
                in its array and display them on separate lines. */}
                {error.map(error => (
                    <div key={error}><b>{error}</b></div>
                ))}
            </div>
        </div> 
        )
    }


