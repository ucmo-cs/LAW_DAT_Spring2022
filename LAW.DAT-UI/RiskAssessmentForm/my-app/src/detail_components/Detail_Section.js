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
    This page displays each section of the page. This pages also handles the accordian menu for each section.
    It's parent component in this project is 'Detail_App.js'. It's child components are 'Detail_Box.js'.
*/

import React from "react";
import Detail_Box from './Detail_Box'

//array for the different values in the select statement. The array contains five as that is the maximum value 
//that a select statement has in this app
var actions_5 = [
    // all value will start from 0
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    {label: "4", value: 4},
    {label: "5", value: 5}
  ];

export default class Detail_Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: this.props.total,  // Instead of initializing with 0, we load the entry's section total
            active: false //state for if accordian is open or closed
        };
    
        //sets handler to current instance
        //handler is then called to get the current section total and display it
        this.handler = this.handler.bind(this);
        }
    
        // This function receives new input values from it's child component and passes those values to its parent component (Detail_App)
        handler(prevState, newState, id) {

          // If the child component passes a null value for the selection, we replace it with 0 (used to mitigate potential errors)
            if(isNaN(prevState))
              prevState = 0;
            if(isNaN(newState))
              newState = 0;

            // This is used to update the section total & display it on the accordion menu
            var x = this.state.total;
            x -= prevState;           // This would be the previous input value
            x += newState;            // This would be the new input value
            this.state.total = x;     // Update the 'total' state with the new calculated value (if setState() is used, causes loop errors)
            
            //this sends the value up to app.js to be displayed. Each page has its own
            //this sends the value up to app.js to be displayed. Each page has its own handler to pass values up from
            //values.js where individual values are selected.
            this.props.handler(prevState, newState, id);
        }
    
        //changes the state of the accordian
        changeActiveState() {
          this.setState((prevState) => ({
            active: !prevState.active
          })) 
        }


        render() {

          //array that will be used by values.js to show what values can be selected i declared empty so the
          // array is not contrantly reinitalised in the loop
          var actions = [];
    
          //section content is set to the the accordiaData that will be shown when the accordian menu  is active

          //the contents are a loop that displays all of the boxes
          //individual boxes are rednered with box.js
          const accordianContent = this.props.contents.map(({ lineNumber, description, maxVal, input }) => (

            //actions is filled by slpiting the actions-5 array into how many numbers are needed
            //if the max value from the JSON file is 4 actions will omit the last entry of actions_5 
            // maxVal+1 so it will include '0'
            actions= actions_5.slice(0, maxVal+1),
            <Detail_Box key={lineNumber} id={lineNumber} Title={description} options={actions} handler={this.handler} input={input}/>
      ))
    
          return (
            // The accordian menu
            <div>
              <div
              // if active is true, this bar will have linear-gradient gray color
              style={{background: this.state.active ? "linear-gradient(145deg, #ffffff, #e6e6e6)" : "#fff"}} 
              className='accordion-title'
              onClick={() => this.changeActiveState()}>
                {/* an empty div for the accordion title to look more like at the center. */}
                {/* (since flex (justify-content: space-between) style is used here, the empty div will go leftmost, and the title in center, and then the toggle goes rightmost) */}
                <div>&nbsp;</div>
                <div>{this.props.name} - {this.state.total}</div>
                <div className='gray-out-text'>{this.state.active ? '🔺' : '🔻'}</div>
              </div>
              {/* if active is true display div */} {/* made it display as flex because the accordion-content couldn't line up each right after with block style */}
              <div style={{display: this.state.active ? "flex" : "none"}} className='accordion-content'>{accordianContent}</div>
            </div>
          )
        }
}