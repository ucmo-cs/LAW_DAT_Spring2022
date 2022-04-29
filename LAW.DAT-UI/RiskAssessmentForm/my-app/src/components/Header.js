import React from 'react'
import '../css/header.css'

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
    This file outlines a component used as the Header of the Risk Assessment form when submitting an original form.
    It's parent component in this project is 'App.js'.
*/

export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
      }// End of constructor
  
      // Before providing the HTML to be rendered, we use the portion between render() and return() to build a date string for display
      render() {

        // Here we build a text to display in the disabled 'Date' field
        const today = new Date()      // Determine current date

        // Since getDay() and getMonth() return integers, we build an array with values corresponding to those integers for the string
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        // Finally we build the date string using the above arrays and Date object
        const date = day[today.getDay()]+' '+month[today.getMonth()]+' '+today.getDate()+' '+today.getFullYear()

        // This section defines what is rendered on the page by the component
        return (

            // Primary div to style the whole header section
            <div className='header-form'>

                {/* Each input field is styled with a separate div */}
                <div className='form-block'>

                    {/* For each form element, we include a label for the input, and placebolder values.
                    For date, our place uses the date string we built above, and input is disabled.*/}
                    <input type="input" id="date" className='input-element' placeholder={date} disabled/>
                    <label htmlFor="date" className='label-element'>Today</label>
                </div>

                {/* All remaining input fields follow the same format */}
                <div className='form-block'>
                    <input type="text" id="trip" className='input-element' placeholder='# Trip Number' required />
                    <label htmlFor="trip" className='label-element'># Trip Number</label>
                </div>
                <div className='form-block'>
                    <input type="text" id="tail" className='input-element' placeholder='Tail Number' required />
                    <label htmlFor="tail" className='label-element'>Tail Number</label>
                </div>
                <div className='form-block'>
                    <input type="text" id="departure" className='input-element' placeholder='Departure ✈' required />
                    <label htmlFor="departure" className='label-element'>Departure ✈</label>
                </div>
                <div className='form-block'>
                    <input type="text" id="destination" className='input-element' placeholder='► Destination' required />
                    <label htmlFor="destination" className='label-element'>► Destination</label>
                </div>

                {/* The break line between header form and sections. It's styled in css! */}
                <hr/>
            </div>
        )
    }
    
}