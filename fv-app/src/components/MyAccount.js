import React, {useState} from 'react';
import MyQuestions from './MyQuestions';
import MyAnswers from './MyAnswers'
import firebase from 'firebase/app';

function MyAccount() {
    const auth = firebase.auth();             // Current user
    const [page,setPage] = useState(0)

    return (
        <div>
            <div>
                <button onClick={(e)=>{setPage(0)}}>Review Questions / Answers to my Questions</button>
                <button onClick={(e)=>{setPage(1)}}>My Answers</button>
                <div>
                    <p>Logged in as: {auth.currentUser.email}</p>
                    <p>Joined on: {auth.currentUser.metadata.creationTime}</p>
                </div>
            </div>
            {
                page === 0 
                ?
                <MyQuestions/>
                :
                <MyAnswers/>
            }
        </div>
    )
}

export default MyAccount;