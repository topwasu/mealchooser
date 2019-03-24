import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props){
    super(props);
    this.addrestaurant = this.addrestaurant.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      restaurant: null,
      recentplace: "...",
      suggestedplace1: null,
      suggestedplace2: null,
      fixedstartDate: new Date(),
      startDate: new Date(),
      meal: "lunch",
      hist: {},
    };
  }

  addrestaurant(){
    this.setState({recentplace: this.state.restaurant});

    fetch('http://localhost:8080/', {method: 'POST', headers:{
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'
    },
    body: JSON.stringify({
      name: this.state.restaurant,
      date: this.state.startDate.toISOString().substring(0,10),
      lord: this.state.meal,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('data', data);
    })
    .catch(err => console.log('ERROR: ', err));

    fetch('http://localhost:8080/', {method: 'GET', headers:{
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'
    }})
    .then(response => response.json())
    .then(data => {
      var i, arr, dateParts, jsDate, diffDays;
      //Restaurant lists
      var score = {"yan": 0, "baja": 0, "sakura": 0, "shakeshack": 0, "soban": 0, "subway": 0, "kabob": 0, "heng": 0};
      var forhist = {"yan": [], "baja": [], "sakura": [], "shakeshack": [], "soban": [], "subway": [], "kabob": [], "heng": []};

      var totalscore = 0, percentscore = {};
      const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

      //sort
      data.sort(function(a,b){
        var dateParts = a.date.split("-");
        var c = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        dateParts = b.date.split("-");
        var d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        return d-c;
      });

      for (i = 0; i < data.length; i++) { 
        //convert ISO date to Javascript date
        dateParts = data[i].date.split("-");
        jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        //keep history
        if(forhist[data[i].name].length < 3) {
          forhist[data[i].name].push(data[i].date.substr(0,10));
        }
        //calculate the differnece
        diffDays = Math.round((this.state.fixedstartDate.getTime() - jsDate.getTime())/(oneDay));
        //add weighted score base on the difference\
        console.log(data[i].name, data[i].date.substr(0,10), diffDays);
        score[data[i].name] += Math.max(14 - diffDays, 0) * 2;
        totalscore += Math.max(14 - diffDays, 0) * 2;
      }

      const keys = Object.keys(score), values = Object.values(score);
      var minval = 10000, maxval = 0, minplace = null, maxplace = null;
      for(i = 0; i < keys.length; i++) {
        if(minval > values[i]) {
          minplace = keys[i];
          minval = values[i];
        }
        if(maxval < values[i]) {
          maxplace = keys[i];
          maxval = values[i];
        }
        while(forhist[keys[i]].length < 3) {
          forhist[keys[i]].push("0000-00-00");
        }
      }
      this.setState({suggestedplace1: maxplace});
      this.setState({suggestedplace2: minplace});
      this.setState({hist: forhist});
    })
    .catch(err => console.log('ERROR: ', err));
  }


  handleChange(event){
    this.setState({restaurant: event.target.value});
  }
  componentDidMount() {
    fetch('http://localhost:8080/', {method: 'GET', headers:{
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'
    }})
    .then(response => response.json())
    .then(data => {
      var i, arr, dateParts, jsDate, diffDays;
      //Restaurant lists
      var score = {"yan": 0, "baja": 0, "sakura": 0, "shakeshack": 0, "soban": 0, "subway": 0, "kabob": 0, "heng": 0};
      var forhist = {"yan": [], "baja": [], "sakura": [], "shakeshack": [], "soban": [], "subway": [], "kabob": [], "heng": []};

      var totalscore = 0, percentscore = {};
      const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

      //sort
      data.sort(function(a,b){
        var dateParts = a.date.split("-");
        var c = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        dateParts = b.date.split("-");
        var d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        return d-c;
      });

      for (i = 0; i < data.length; i++) { 
        //convert ISO date to Javascript date
        dateParts = data[i].date.split("-");
        jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
        //keep history
        if(forhist[data[i].name].length < 3) {
          forhist[data[i].name].push(data[i].date.substr(0,10));
        }
        //calculate the differnece
        diffDays = Math.round((this.state.fixedstartDate.getTime() - jsDate.getTime())/(oneDay));
        //add weighted score base on the difference\
        console.log(data[i].name, data[i].date.substr(0,10), diffDays);
        score[data[i].name] += Math.max(14 - diffDays, 0) * 2;
        totalscore += Math.max(14 - diffDays, 0) * 2;
      }

      const keys = Object.keys(score), values = Object.values(score);
      var minval = 10000, maxval = 0, minplace = null, maxplace = null;
      for(i = 0; i < keys.length; i++) {
        if(minval > values[i]) {
          minplace = keys[i];
          minval = values[i];
        }
        if(maxval < values[i]) {
          maxplace = keys[i];
          maxval = values[i];
        }
        while(forhist[keys[i]].length < 3) {
          forhist[keys[i]].push("0000-00-00");
        }
      }
      this.setState({suggestedplace1: maxplace});
      this.setState({suggestedplace2: minplace});
      this.setState({hist: forhist});
    })
    .catch(err => console.log('ERROR: ', err));
  }


  render() {
    console.log('restaurant: ', this.state.restaurant);
    return (
      <div class="container-fluid" style={{padding:50, textAlign:'center'}}>
        <div class="row">
          <div class="col-lg-12" style={{padding:50, fontSize: 40}}>
            MEAL PLANNER
          </div>
          <div class="col-lg-12" style={{padding:50}}>
            <select id="dropdown" value={this.state.restaurant} onChange={this.handleChange}>
              <option value="0">Where did you just eat?</option>
              <option value="yan">Yan's Cuisine</option>
              <option value="baja">Baja’s Tex Mex Grill</option>
              <option value="sakura">Sakura Sushi</option>
              <option value="shakeshack">Shake Shack</option>
              <option value="soban">Soban Korean Eatery</option>
              <option value="subway">Subway Sandwich</option>
              <option value="kabob">Kabob and Curry</option>
              <option value="heng">Heng Thai and Rotisserie</option>
            </select>
            <DatePicker
              selected={this.state.startDate}
              onChange={(newDate) => this.setState({startDate: newDate})}
              dateFormat="YYYY-MM-dd"
            />
            <select value={this.state.meal} onChange={(event) => this.setState({meal: event.target.value})}>
              <option value="0">Lunch or Dinner?</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <button onClick={this.addrestaurant}>Submit</button>
          </div>
          <div class="col-lg-12" style={{padding:20}}>
            You just chose: {this.state.recentplace}
          </div>
          <div class="col-lg-12" style={{padding:20}}>
            Where to go for your next meal: 
                <div>If you love the food that you are eating these days: {this.state.suggestedplace1}</div>
                <div>If you are so bored and want to eat something you haven't had for so long: {this.state.suggestedplace2}</div>
          </div>
          <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-3">
                  Last three meals at Yan's Cuisine
                  <ul>
                    {(this.state.hist.yan || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Baja’s Tex Mex Grill
                  <ul>
                    {(this.state.hist.baja || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Sakura Sushi
                  <ul>
                    {(this.state.hist.sakura || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Shake Shack
                  <ul>
                    {(this.state.hist.shakeshack || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
            </div>
          </div> 
          <div class="col-lg-6">
              <div class="row">
                <div class="col-lg-3">
                  Last three meals at Soban Korean Eatery
                  <ul>
                    {(this.state.hist.soban || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Subway Sandwich
                  <ul>
                    {(this.state.hist.subway || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Kabob and Curry
                  <ul>
                    {(this.state.hist.kabob || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
                <div class="col-lg-3">
                  Last three meals at Heng Thai
                  <ul>
                    {(this.state.hist.heng || []).map(function(name, index){
                      return <li key={ index }>{name}</li>;
                    })}
                  </ul>
                </div>
              </div>
          </div>
      </div>
      </div>
    );
  }
}
export default App;
