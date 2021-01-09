import './App.css';
import Navigation from './Components/Navigation/Navigation';
import React, {Component} from 'react';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import Particles from 'react-particles-js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import SignIn from './Components/SignIn/Signin.js';
import Register from './Components/Register/Register.js';



const app = new Clarifai.App({
  apiKey: '684ef94f777741348391d05b82047dab'
  })
const particlesOptions = {
                particles: {
                  number: {
                    value: 60,
                    density: {
                      enable: true,
                      value_area: 800
                    }
                  }
                }
              }

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
    };
  }
  

  calculateFaceLocation = (data) => {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      const array_of_faces = data.outputs[0].data.regions.map( face => {
        const face_box = face.region_info.bounding_box;
        return {
          leftCol: face_box.left_col * width,
          topRow: face_box.top_row * height,
          rightCol: width - (face_box.right_col * width),
          bottomRow: height - (face_box.bottom_row * height),
        }
      });
      return array_of_faces;
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  } 

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input).then(response => {
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch(err => console.log(err))
  }


  onRouteChange = (route) => {
    if(route === 'signout')
      this.setState({isSignedIn: false});
    else if(route === 'home')
      this.setState({isSignedIn: true});
    this.setState({route: route});
  }
    
  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' ? 
          <div>
            <Logo/>
            <Rank/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes}/>
          </div>
          : (
            this.state.route === 'register' ? <Register onRouteChange={this.onRouteChange}/> : <SignIn onRouteChange={this.onRouteChange}/> 
          )
        }        
      </div>)
  }
}

 

export default App;
