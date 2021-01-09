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
      boxes: [],//make this an array
      route: 'signin',
    };
  }
  /*constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},//make this an array
      route: 'signin',
    };
  }*/

  calculateFaceLocation = (data) => {
    //const boxes = [];
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      const array_of_faces = data.outputs[0].data.regions.map( face => {
        const face_box = face.region_info.bounding_box;
        return { //return boxes which is an array
          leftCol: face_box.left_col * width,
          topRow: face_box.top_row * height,
          rightCol: width - (face_box.right_col * width),
          bottomRow: height - (face_box.bottom_row * height),
        }
      });
      return array_of_faces;
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;// const clarifaiFaces = data.outputs[0].data.regions (this is an array which you need to loop over)
  }

/*calculateFaceLocation = (data) => {
    //const boxes = [];
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;// const clarifaiFaces = data.outputs[0].data.regions (this is an array which you need to loop over)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return { //return boxes which is an array
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }*/
  displayFaceBox = (boxes) => {//pass the array of boxes
    console.log(boxes);
    this.setState({boxes: boxes});
  } 
 /* displayFaceBox = (box) => {//pass the array of boxes
    console.log(box);
    this.setState({box: box});
  }*/

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  /*onInputChange = (event) => {
    this.setState({input: event.target.value});
  }*/

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input).then(response => {
          // console.log("Hey this is the response Clarifai has sent for you : ", response);
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
      // .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err))
  }

   /*onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input).then(response => {
          console.log("Hey this is the response Clarifai has sent for you : ", response);
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
      // .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err))
  }*/

  onRouteChange = (route) => {
    this.setState({route: route});
  }
    
  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange}/>
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
  }//in FaceRecognition pass boxes array

  /*render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange}/>
        { this.state.route === 'signin' ? <SignIn onRouteChange={this.onRouteChange}/> : 
          <div>
            <Logo/>
            <Rank/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
          </div>
        }        
      </div>)
  }*/
}

 

export default App;
