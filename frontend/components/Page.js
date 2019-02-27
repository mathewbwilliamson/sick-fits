import React, { Component } from 'react'

class Page extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <p>Hey I'm the Page</p>
                {this.props.children}
            </div>
         );
    }
}
 
export default Page;