import * as React from 'react'
import { inject,observer } from 'mobx-react'
@inject('store')
@observer 
class Cal extends React.Component{
    constructor(props){
        super(props)
    }

    add = () => {
        this.props.store.add()
    }

    reduce = () => {
        this.props.store.reduce()
    }

    render(){
        return(
            <React.Fragment>    
                {/* <div>{this.props.store.retunum}</div>
                <div>{this.props.store.addNum}</div> */}
                <div>{this.props.store.num}</div>
                <div onClick ={this.add} >+</div>
                <div onClick ={this.reduce} >-</div>
            </React.Fragment>   
        )
    }
}

export default Cal


function Parent(parent){
    this.parent = parent
}
Parent.prototype.getParent = function(){
    console.log(this.parent)
}
function Child(parent,child){
    Parent.call(this,parent)
    this.child = child
}
// Child.prototype = new Parent()
// Child.constructor = Child

function Extends(Parent,Child){
    Child.prototype = Object.create(Parent.prototype)
    Child.constructor = Child   

}

Object.prototype.create = function(prototype){
   let F = () => {}
   F.prototype = prototype
   let res = new F()
   res.constructor = F
   return F
}