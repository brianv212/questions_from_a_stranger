import React, {useState} from 'react';
import firebase from 'firebase/app';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import '../styles/MyQuestions.css';
import '../styles/bubbleText.css'


function MyAnswers() {
    const auth = firebase.auth();             // Current user
    const firestore = firebase.firestore();   // Database

    // Gets the data from the firestore database
    const questionsRef = firestore.collection('questions');

    // Gets the questions a user has answered
    const answeredQuery = questionsRef.where("uid", "!=", firebase.auth().currentUser.uid);
    const [q] = useCollectionData(answeredQuery, {idField: 'id'});
    let answeredDocs = [];
    if (q){
      for (let i = 0; i < q.length; i++){
        if (auth.currentUser.uid in q[i].answers){
            answeredDocs.push(q[i]);
        }
      }     
    }

    const [questionDoc, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [OPresponse, setOPResponse] = useState("");

    const setValues = (e) => {
        setQuestion(e);
        setResponse(e.answers[auth.currentUser.uid])
        if (auth.currentUser.uid in e.responses){
            console.log("Yes!")
            let res = e.responses[auth.currentUser.uid];
            if (res === "liked"){
               setOPResponse("They liked this answer!") 
            }
            else{
                setOPResponse("They didn't like this answer")
            }
        }
    }

    // Create another secion for "My answers"
    return (
         <div className="user-page" style={{marginBottom:"2rem"}}>
            <div className="left-side">
                <div className="left-side-container">
                    {answeredDocs && answeredDocs.map(q => 
                    <div key={q.id}>
                        <div onClick={() => setValues(q)} className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll"}}>{q.text}</div>
                    </div>
                    )}
                </div>
            </div>

            {questionDoc !== ""
            ?
            <div style={{width: "70%"}}>
                <p className="question-selection">{questionDoc.text}</p>
                <div className="question-answers" style={{backgroundColor: "#2CA1FC"}}>
                    <p>{response}</p>
                    <p>{OPresponse}</p>
                </div>
            </div>            
            :
            <div></div>
            }                
        </div>
    )
}

export default MyAnswers