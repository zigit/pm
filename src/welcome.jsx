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
                    href='#/galaxy/sverige?cx=11391&cy=-13150&cz=-14178&lx=0.1801&ly=0.8995&lz=-0.2285&lw=0.3259&ml=5000&s=1.5&l=1&v=2015-12-12T20-00-00Z'
                    media='bower_fly_first.png'
                    name='Sverige'/>
        </div>
      </div>
    );
  }
}
