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
    This file outlines a component used as the Header of the Risk Assessment form when editing a previous submission.
    It's parent component in this project is 'Detail_App.js'.
*/

import React from "react";
import '../css/header.css'

export default class Detail_Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // This is used to set the default value for the datetime picker
        var now = new Date(this.props.data.date);
        var offset = now.getTimezoneOffset() * 60000;
        var adjustedDate = new Date(now.getTime() - offset);
        this.formattedDate = adjustedDate.toISOString().substring(0,16);
    }// End of constructor

    // This section defines what is rendered on the page by the component
    render() {
        return (

            // Primary div to style the whole header section
            <div className='header-form'>
                
                {/* the break line between header form and sections. it's styled in css! */}
                <hr/>

                {/* Each input field is styled with a separate div */}
                <div className='form-block-detail'>
                    
                    {/* For each form element, we include a label for the input, and default values.
                    For date, our default value is reformatted in the constructor to display properly in the input field.*/}
                    <input type="datetime-local" id="date" className='input-element' defaultValue={this.formattedDate}/>
                    <label htmlFor="date" className='label-element'>Date & Time</label>
                </div>

                {/* All remaining input fields follow the same format */}
                <div className='form-block-detail'>
                    <input type="text" id="tail" defaultValue={this.props.data.tailNum} className='input-element' placeholder='Tail Number' required />
                    <label htmlFor="tail" className='label-element'>Tail Number</label>
                </div>
                <br/>
                <div className='form-block-detail'>
                    <input type="text" id="departure" defaultValue={this.props.data.departure} className='input-element' placeholder='Departure ✈' required />
                    <label htmlFor="departure" className='label-element'>Departure ✈</label>
                </div>
                <div className='form-block-detail'>
                    <input type="text" id="destination" defaultValue={this.props.data.destination} className='input-element' placeholder='► Destination' required />
                    <label htmlFor="destination" className='label-element'>► Destination</label>
                </div>                
            </div>
        )
    }
}