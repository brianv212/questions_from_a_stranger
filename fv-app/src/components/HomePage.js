import React, {useState} from 'react';
import '../styles/App.css';
import '../styles/sign.css';
import '../styles/bubbleText.css';


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useCollectionData} from 'react-firebase-hooks/firestore';

// Main Menu
function HomePage () {
    const auth = firebase.auth();             // Current user
    const firestore = firebase.firestore();   // Database

    // Gets the data from the firestore database
    const questionsRef = firestore.collection('questions');
    const query = questionsRef.where("uid", "!=", firebase.auth().currentUser.uid);
    const [q] = useCollectionData(query, {idField: 'id'});

    let questions = [];
    if (q){
      for (let i = 0; i < q.length; i++){
        if (!(auth.currentUser.uid in q[i].answers)){
          questions.push(q[i]);
        }
      }     
    }


    
    // Handles the currently selected question
    const [questionDoc, setQdoc] = useState(null);
    const [currentQuestionID, setCurrentQuestionID] = useState("");
    const setQuestionDoc = (e) => {
      setCurrentQuestionID(e.id);
      setQdoc(e);
    }
  
    // Handles all responses from other users to a post.
    const [answerFormValue, setAnswerFormValue] = useState('');
    const [error, setError] = useState("What do you think?");
    const sendAnswer = async (e) => {
      e.preventDefault();
      if (answerFormValue === ""){
        setError("Please write something meaningful for the original poster to review!")
      }
      else {
        setError("")
        let map = questionDoc.answers;
        map[auth.currentUser.uid]  = answerFormValue;
    
        questionsRef.doc(questionDoc.id).update({answers: map});
        await questionsRef.doc(questionDoc.id).update (
          {
            answers: map
          }
        );
        setAnswerFormValue("");
        setQuestionDoc("");
        setCurrentQuestionID("");
      }
    }

    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Enter' && !keyEvent.shiftKey)
      {
          // prevent default behavior
          keyEvent.preventDefault();
      }
    }
  
    return (
    <div className="fv-app">
      <div className="left-side">
        <p>Newest</p>
        <div className="left-side-container">
          {questions.length === 0 ? <div className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll",fontWeight:"bold"}}>
            Hmm.. It seems a bit quiet right now! Maybe you can ask a question instead.</div>
          :<div></div>}
          {questions && questions.map(q => 
          <div key={q.id}>
              <hr className="separator"></hr>
              {currentQuestionID === q.id
              ? <div onClick={() => setQuestionDoc(q)} className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll", backgroundColor: "#c9c9cf"}}>{q.text}</div>
              : <div onClick={() => setQuestionDoc(q)} className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll"}}>{q.text}</div>
              }
              
          </div>
          )}
        </div>
        <p>Oldest</p>
      </div>

      {currentQuestionID === "" 
      ?
      <div className="display-question">
        <p className="bubble" style={{margin: "5rem 5rem 0rem 8rem"}}>Any unanswered question appears here. 
        You only get one chance to make a good impression, so make your answer count!</p>
      </div>
      :
      <div className="display-question">
        <div className="bubble" style={{margin: "4rem 0rem 0rem 8rem", height:"30%", width: "70%", overflowX: "scroll"}}>
          <p style={{overflowX: "scroll"}}>{questionDoc.text}</p>
        </div>
        <div className="reply-to-question">
          <form onKeyDown={onKeyDown}>
            <p style={{margin: "27rem 2rem 0rem 2rem"}}>{error}</p>
            <textarea value={answerFormValue} onChange={(e) => {setAnswerFormValue(e.target.value)}} className="answer-form"/>
          </form>
          <button onClick={sendAnswer} style={{border: "none", fontFamily: "Comfortaa", marginLeft: "45%", backgroundColor: "#2CA1FC"}}>Submit Your Answer</button>
        </div>
      </div>
      }
    </div>      
    )
  }

  export default HomePage;