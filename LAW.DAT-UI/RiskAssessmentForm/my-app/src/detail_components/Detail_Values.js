import React from "react"
import Select from 'react-select'

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
    This page displays information relevant to reach line in the Risk Assessment Form, and hosts the value selector.
    It's parent component in this project is 'Detail_Section.js'. It's child component is 'Section_Values.js'.
*/

//construcor
export default class Detail_Values extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          selectedOption: this.props.options[this.props.input],
          selectedVal: this.props.input,
        }
    
        this.selectors = []
        for(var i=0;i<=this.props.maxVal;i++)
          this.selectors.push(i);  
      }
    
       //function that changes the option and value when a new object on the select statement is selected
      //selected option is for display purposes and selected value is the internal value
      handleChange = (selectedOption,selectedVal) => {
        this.setState({ selectedOption })
        selectedVal=selectedOption.value
        this.setState({selectedVal})
      }
    
        //when a new value is selected, function sends the previous state and selected value
        // an inteiger value is also parsed from the selectedVal object
        componentDidUpdate(prevProp, prevState) {
          //handler takes the previous value, the new selected value and the current box id
         //this is then sent up to the box.js's handler function
        this.props.handler(parseInt(prevState.selectedVal), parseInt(this.state.selectedVal), this.props.id)
      }
    
      render() {
        return (
          <div className='flightValueStyle'>

             {/* Displays title for the section */} <span>{this.props.name}</span> 

       {/*Select is an imported library that hadles the select statements for the application
       The selected options and values are taken and displayed
       When a new value is selected, the onChange function sets the options and values to the new one selected */}
            <span>{this.props.name}</span>
            <Select
              menuIsOpen // keep the menu always open
    
              // these two lines will keep scrolling functional even when mouse is hover on menu selection
              onMenuScrollToTop
              onMenuScrollToBottom
              
              //current options and values in the select statement
              options={ this.props.options }
              value={this.state.selectedOption}
              
              //function to handle change 
              onChange={this.handleChange}

              //style for selected options 
              styles={{
                // change the background color of a selected value
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#273c50' : '#fff'
                })
              }}
            />
          </div>
        )
      }
}