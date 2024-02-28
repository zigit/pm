import React from "react";
import Destination from './destination.jsx';

export default class WelcomePage extends React.Component {
  render() {
    return (
      <div className='container'>
        <h1>Welcome to the Space of Law, Citizen!</h1>
        <h2>Choose your destination:</h2>
        <div className='media-list'>
        <Destination description='Svea Rikes Lag'
                    href='#/galaxy/sverige?cx=-4116&cy=4552&cz=11836&lx=0.1951&ly=-0.3009&lz=-0.9282&lw=0.0991&ml=150&s=1.75&l=1&o=0'
                    media='lagrymden.png'
                    name='Sverige'/>
        </div>
        <div><br></br><br></br><br></br><br></br><br></br><br></br><br></br><a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img title="ResponsiveVoice Text To Speech" src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png" alt="95x15" width="95" height="15" /></a></div>
      </div>
    );
  }
}
