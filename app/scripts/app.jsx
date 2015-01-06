/** @jsx React.DOM */
/*jshint indent: 2, node: true, nomen: true, browser: true*/
/*global React */


var _ =  require("underscore")
var React = require('react');
var Firebase = require('firebase');


var Comp = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {
            data : [],
            user : "",
            variable : {}
        };
    },
    displayUser: function(user, i){
        var classN = ""
        if(user.id == this.state.variable[0]){
            classN = "winer"
        }
        return(
                <div className={"user  "+classN}>
                    <p>{user.name}</p>
                </div>
            );

    },

    addUser: function(){
        event.preventDefault();

        this.firebaseRefs["data"].push({'id': Math.floor((Math.random() * 100000) + 1)
            ,  'name': this.state.user });

    },
    render: function() {
        var users = this.state.data.map(this.displayUser);

        return (
            <div className="containe">

            <img className="img-responsive center-block" src="img/cups.png"/>
            <h1 className="titre">Qui va faire le café ?</h1>

            {users}
            <form onSubmit={this.addUser}>
            <input placeholder="Add user" className="txtUser" onChange={this.handleChange} type="text"/>
            </form>

            <button className="center-block buttonWiner" onClick={this.getWiner}>Trouver le champion</button>
            </div>
        );
    },
    getWiner:function()
    {
        var winer = this.state.data[Math.floor((Math.random() * _.size(this.state.data)))];

        
        this.firebaseRefs["variable"].update({ 'lastUser' :  winer.id});

        this.setState({winer : winer.id});
        this.postOnSlack(winer.name);

    },
    postOnSlack:function(name){
        $.ajax({
          type: "POST",
          url: '',
          data: "@" + name + " tu dois faire le café :)"
        });
    },
    handleChange:function(e){
        this.setState({user : e.target.value});
        console.log(this.state.user);

    },
    componentWillMount: function() {
        this.bindAsArray(new Firebase("https://appcofee.firebaseio.com/user"), "data");
        this.bindAsArray(new Firebase("https://appcofee.firebaseio.com/variable"), "variable");
    },

});



React.renderComponent(
  <Comp />,
  document.getElementById('contain')
);
