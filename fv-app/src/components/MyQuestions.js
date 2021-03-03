import React, {useState} from 'react';
import firebase from 'firebase/app';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import '../styles/MyQuestions.css';
import '../styles/App.css';
import '../styles/bubbleText.css';


function MyQuestions() {
    const auth = firebase.auth();             // Current user
    const firestore = firebase.firestore();   // Database

    // Gets the data from the firestore database
    const questionsRef = firestore.collection('questions');
    const userBase = firestore.collection('users');

    // Gets the questions created by the current user
    const userQuery = questionsRef.where("uid", "==", firebase.auth().currentUser.uid);
    const [userQuestions] = useCollectionData(userQuery, {idField: 'id'});
    const [questionDoc, setQuestion] = useState("")

    // Handles likes / dislikes
    const upDateDoc = async (key, val) => {
        let s = 0;
        let copy_responses = questionDoc.responses;
        copy_responses[key] = val;
        await questionsRef.doc(questionDoc.id).set (
            {
                text: questionDoc.text,
                createdAt: questionDoc.createdAt,
                uid : questionDoc.uid,
                answers: questionDoc.answers,
                responses: copy_responses
            }
        );
        if (val === "liked"){
            s += 1
        }
        else {
            s -= 1
        }

        await userBase.doc(key).update (
            {
                score: firebase.firestore.FieldValue.increment(s)
            }
        );
    }

    // Create another secion for "My answers"
    return (
        <div className="user-page" style={{marginBottom:"2rem"}}>
            {/* class "side-bar" from "App.css" */}
            <div className="left-side">
                <div className="left-side-container">
                    {userQuestions && userQuestions.map(q => 
                    <div key={q.id}>
                        {
                            questionDoc === q
                            ? <div onClick={() => setQuestion(q)} className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll", backgroundColor: "#c9c9cf"}}>{q.text}</div>
                            : <div onClick={() => setQuestion(q)} className="bubble" style={{marginLeft:"1rem", width:"85%", height:"150px", overflowX: "scroll"}}>{q.text}</div>
                        }
                        
                    </div>
                    )}
                </div>
            </div>
            {questionDoc !== ""
            ?
            <div style={{width: "840px"}}>
                <p className="ft-response" style={{margin: "0rem 5rem 0rem 10rem", height: "300px", overflowX: "scroll", textAlign: "left"}}>{questionDoc.text}</p>
                <div className="question-answers">
                    {Object.keys(questionDoc.answers).map((k,index) => (
                        <div key={index} style={{marginLeft: "1rem"}}>
                            <p>{questionDoc.answers[k]}</p>
                            <div>
                                <button 
                                    onClick={() => upDateDoc(k, "liked")} 
                                    disabled={questionDoc.responses[k] === "liked"}>
                                    I liked this answer!
                                </button>
                                <button 
                                    onClick={() => upDateDoc(k, "disliked")}
                                    disabled={questionDoc.responses[k] === "disliked"}>
                                    I didn't like this answer...
                                </button>
                            </div>
                            <hr></hr>
                        </div>
                    ))}
                </div>                
            </div>            
            :
            <div></div>
            }                
        </div>
    )
}

export default MyQuestions