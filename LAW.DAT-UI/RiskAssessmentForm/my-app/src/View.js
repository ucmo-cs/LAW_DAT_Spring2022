import React, {useState, useEffect} from "react"
import {Link} from 'react-router-dom'
import {get} from './crud'
import './css/view.css'

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
    This page displays the header information of all entries in the database, and navigates the user to an edit page
    of a selected entry.
*/

class View extends React.Component {

    render() {

        // structure for the getAll() in crud.js to receive parameter
        const getData = {
            "params": {
                "httpMethod": "GET",
                "amount": "ALL"
            }
        }

        // this function holds the data from getAll() and return for rendering
        const AllData = () => {

            // it just works somehow
            // setData --> data
            const [data, setData] = useState([])
            // inside the useState() here has to be an array to hold the data

            // getAll(getData) --> setData --> data
            // works somehow
            useEffect(() => {
                get(getData).then(data => setData(data))
            }, [])
            // [] is required at the end of this function call here (to prevent infinity loop)

            // control for different color frames (base on the number of risk return)
            // strings return refers to css className
            const ColorFrame = (value) => {
                if(value < 20)
                    return "green-frame"
                else if(value >= 20 && value < 25)
                    return "orange-frame"
                else
                    return "red-frame"
            } // will be called in the later div loop output

            // control for different icons(emoji) to show (base on the number of risk return)
            const RiskIcon = (value) => {
                if(value < 20)
                    return <span>🟢</span>
                else if(value >= 20 && value < 25)
                    return <span>🔶</span>
                else
                    return <span>🛑</span>
            } // will be called beside the 'Total Risk' in the later loop output

            useEffect(() => {
                document.getElementById('navbar').style.boxShadow = "0 0 8px rgba(0, 0, 0, .3)"
            }, [])
            
            return (
                // loop through the data
                // slice(0) make a copy so that the original order won't be changed
                // reverse() so that the newest data will be show on the top
                data.slice(0).reverse().map(item => (
                    // tripNum as key should be unique as requirement
                    <div key={item.header.tripNum}>
                        {/* link to detail page and send parameters */}
                        <Link to={"/detail"}
                        state={{
                            "params": {
                                "httpMethod": "GET",
                                "amount": "ONE",
                                "key": item.header.tripNum
                            }
                        }}
                        className="detail-link"
                        // hover hint
                        title="Click to Edit Details">
                            {/* call ColorFrame() as the className to determine the frame color */}
                            <div className={ColorFrame(item.header.totalRisk)}>
                                <div className="trip-number-title">
                                    <b>Trip Number</b> {item.header.tripNum}
                                </div>
                                <div className="info-block">
                                    <b>✈ Departure</b><br/> {item.header.departure}
                                </div> 
                                <div className="info-block">
                                    <b>► Destination</b><br/> {item.header.destination}
                                </div>
                                <div className="info-block">
                                    <b>Tail Number</b><br/> {item.header.tailNum}
                                </div>
                                <div className="info-block">
                                    <b>Date</b><br/> {item.header.date.substring(0, 16)}
                                    {/* substring(0, 16): get the first 16 char */}
                                    {/* e.g. Fri Apr 15 2022 21:05:10 GMT-0500 (Central Daylight Time) */}
                                    {/* will return as Fri Apr 15 2022 */}
                                </div>
                                {/* call RiskIcon() to determine the risk icons(emoji) */}
                                <div className="info-block"><b>Total Risk</b> {RiskIcon(item.header.totalRisk)}<br/>
                                    {item.header.totalRisk}
                                </div>
                                <div className="info-block" style={{width:'270px'}}>
                                    <b>Time</b><br/>
                                    {/* use span to write special style here for better alignment */}
                                    <span style={{fontSize:'.88em', verticalAlign:'top'}}>
                                        {item.header.date.substring(16)}
                                        {/* substring(16): get the part after 16 char */}
                                        {/* e.g. Fri Apr 15 2022 21:05:10 GMT-0500 (Central Daylight Time) */}
                                        {/* will return as 21:05:10 GMT-0500 (Central Daylight Time) */}
                                    </span>
                                </div>
                            </div> {/* end div ColorFrame */}
                        </Link>
                    </div> // end div key
                )) // end data.map loop
            ) // end return
        } // end AllData
        
        return (
            // class 'main-frame' for centralize the content
            <div className="main-frame">
                {/* call AllData to render content */}
                <AllData/>
            </div>
        )
    } // end render
} // end View

export default View