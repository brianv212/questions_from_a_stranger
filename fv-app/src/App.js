import React, {useState} from 'react';
import {ReactComponent as CaretIcon} from './styles/menu.svg';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link} from 'react-router-dom';

import './styles/App.css';
import './styles/sign.css';
import './styles/bubbleText.css';

import HomePage from './components/HomePage';
import About from './components/About';
import Header from './components/header';
import MiniHeader from './components/headerMini';
import AskAQuestion from './components/AskAQuestion';
import MyAccount from './components/MyAccount';

import google from './google.png';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


// Firebase Initialization
firebase.initializeApp ({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
})

const auth = firebase.auth();             // Current user
const firestore = firebase.firestore();   // Database


// Controls whether a user is signed in.
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        {user ? <Introduction /> : <SignIn />}
      </section>
    </div>
  );
}

// Sign In - Sign Out Methods
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className="login-screen">
      <Header />
      <div className="intro">
        <hr className="top-line"></hr>
        <div>Can you trust a stranger's answer?</div>
        <div>Ask anonymously, get answers anonymously.</div>
        <div>It's that simple.</div>
      </div>
      
      <hr className="bottom-line"></hr>
      <div className="sign-in">
        <button onClick={signInWithGoogle}>
          <img src={google}/>
          <p>Sign in with Google.</p>
        </button>
      </div>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <div className="sign-out">
      <button onClick={() => auth.signOut() } href="" className="sign-out-button">Sign Out</button>
    </div>
  )
}

function Introduction () {
  const [firstTimeSequence, setFirstTimeSequence] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [nameInput,setNameInput] = useState("");

  const userDatabase = firestore.collection('users');
  const query = userDatabase.where("uid", "==", firebase.auth().currentUser.uid);
  let [q] = useCollectionData(query);
  const checkUser = () => {
    setButtonClicked(true);
    if (q.length === 0){
      setFirstTimeSequence(true)
    }
  }

  const getUserData = async(e) => {
    console.log("Submitting User")
    e.preventDefault();
    if (nameInput.length < 4){
        alert("Please enter a name of at least 4 characters")
    }
    else {
        const {uid} = auth.currentUser;
        await userDatabase.doc(auth.currentUser.uid).set (
        {
            name: nameInput,
            uid,
            score: 1
        }
        );
        setNameInput('');
        setFirstTimeSequence(false)
    }
  }

  const onKeyDown = (keyEvent) => {
    if (keyEvent.key == 'Enter')
    {
        // prevent default behavior
        keyEvent.preventDefault();
    }
}

  return(
  <div>
    {buttonClicked === false 
    ? 
      <div>
        <Header/>
        <div className="bubble">
            Ask your questions anonymously and you shall receive your answers anonymously. Are you ready to give your
            two cents to a total stranger?
        </div>
        <div className="ft-response">
          <button onClick={checkUser} className="ft-enter-button">I'm Ready!</button>
        </div>
      </div>
    :
      <div>
        {firstTimeSequence === true 
          ?
            <div>
              <Header/>
              <div className="bubble">
                Ask your questions anonymously and you shall receive your answers anonymously. Are you ready to give your
                two cents to a total stranger?
              </div>
              <div className="ft-response">
                <p className="ft-enter-nonclickable">I'm Ready!</p>
              </div>
              <div className="bubble">
                Great! Let's get started with a your nickname! ( For leaderboard purposes only )
              </div>
              <div className="ft-response">
                <form onKeyDown={onKeyDown}>
                  <input value={nameInput} onChange={(e) => {setNameInput(e.target.value)}} className="username-input"></input>
                  <button onClick={getUserData} className="username-submit">This is me!</button>
                </form>
              </div>
            </div> 
          : 
            <Main/>
        }
      </div>
    }
  </div>    
  )

}

// Main Menu
function Main () {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="navbar-nav" >
            <li><a className="icon-button" onClick={() => {setOpenMenu(!openMenu)}}><CaretIcon /></a></li>
            {openMenu ? 
            <div className="dropdown">
              <SignOut />
              <Link to="/" style={{color: "blanchedalmond"}}><li>Home</li></Link>
              <Link to="/myaccount" style={{color: "blanchedalmond"}}><li>My Account</li></Link>
              <Link to="/ask" style={{color: "blanchedalmond"}}><li>Ask A Question!</li></Link>
              <Link to="/about" style={{color: "blanchedalmond"}}><li>About</li></Link>
            </div>  
            : <div></div>}
          </ul> 
          <MiniHeader/>           
        </nav>

          {/* <Header /> */}
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/about" exact component={About} />
          <Route path="/ask" exact component={AskAQuestion} />
          <Route path="/myaccount" exact component={MyAccount} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;