import React from 'react';

function MiniHeader (){
    // const backToMenu = () => {
    //     window.location = "/";
    // }
    return (
        <div>
            <h1 style={style}>QUESTIONS FROM A STRANGER</h1>
        </div>
    )
}

const style = {
    textAlign: "center",
    color: "white",
    fontSize: "32px",
    textShadow: "2px 2px rgb(107, 107, 107)",
    marginTop: "15px",
    marginLeft: "3rem"
}

export default MiniHeader;