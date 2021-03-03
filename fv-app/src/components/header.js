import React from 'react';

function Header (){
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
    color: "rgb(31, 93, 185)",
    fontSize: "48px",
    textShadow: "2px 2px rgb(107, 107, 107)",
    marginTop: "5rem",
}

export default Header;