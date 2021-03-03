import React, {useState} from 'react';

import '../styles/AskAQuestion.css'

import firebase from 'firebase/app';

function AskAQuestion () {
    const auth = firebase.auth();             // Current user
    const firestore = firebase.firestore();   // Database
    const questionsRef = firestore.collection('questions');
    const [formValue,setFormValue] = useState("");
    const [asked, setAsked] = useState(false);
    const [error,setError] = useState("")
    const askQuestion = async(e) => {
        console.log("Submitting Question")
        e.preventDefault();
        if (formValue === ""){
            setError("Please enter text to submit as a question")
        }
        else {
            setError("")
            const {uid} = auth.currentUser;
            await questionsRef.add (
                {
                    text: formValue,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid,
                    answers: {},
                    responses: {}
                }
            );
            setFormValue('');
            setAsked(true);
        }
    }


    const onKeyDown = (keyEvent) => {
        if (keyEvent.key == 'Enter' && !keyEvent.shiftKey)
        {
            // prevent default behavior
            keyEvent.preventDefault();
        }
    }

    return (
        <div className="askAQuestion">
            <p>Ask a Question! It's anonymous</p>
            {asked === false ? 
            <div>
                <div className="error">{error}</div>
                <form onKeyDown={onKeyDown} className="form">
                    <textarea value={formValue} onChange={(e) => {setFormValue(e.target.value)}} className="question_form" />
                </form>
                <button className="form_button" onClick={askQuestion}>Submit!</button>
            </div>
            
            :
            <div>
                Thanks! You can review your question under "My Account". It will not appear in the Homepage for you, but it will for others!
            </div>
            }
        </div>
    )
}

export default AskAQuestion;