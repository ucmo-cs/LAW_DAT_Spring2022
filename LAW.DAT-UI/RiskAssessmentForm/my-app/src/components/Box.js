import React from "react"
import Values from './Values'

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
    It's parent component in this project is 'Section.js'. It's child component is 'Values.js'.
*/

class Box extends React.Component {
    constructor(props) {
        super(props)
    this.handler = this.handler.bind(this)
    }   // End of constructor

    // This function receives new input values from it's child component and passes those values to its parent component (Section)
    handler(prevState, newState, id) {

        // If the child component passes a null value for the selection, we replace it with 0 (used to mitigate potential errors)
        if(isNaN(prevState))
            prevState = 0
        if(isNaN(newState))
            newState = 0

        // We invoke our parent component's handler function and pass the input values to it
        this.props.handler(prevState, newState, id)
    }

    // This section defines what is rendered on the page by the component
    render() {
        return ( 

            // We use this div to style the overall box component
            <div className='boxStyle'>

                {/* We use a separate div to style the title of the box */}
                <div className='boxHeaderStyle'>{this.props.Title}</div>

                {/* In reach Box component, we render a Values component to select input values. For props, we pass
                'name' as a label for the selection, 'options' to be displayed by the component, and 'id' corresponding
                to the line number in the JSON being rendered by the component */}
                <Values name="Flight Value" options ={this.props.options} handler={this.handler} id={this.props.id}/>
            </div>
        )
    }
}
export default Box
