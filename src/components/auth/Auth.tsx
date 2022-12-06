import SignUp from "./SignUp";
import {useState} from "react";
import SignIn from "./SignIn";

function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true)

    return (
        <>
            {isLoginMode && <SignIn switchToSignup={() => setIsLoginMode(false)}/>}
            {!isLoginMode && <SignUp switchToLogin={() => setIsLoginMode(true)}/>}
        </>
    )
}

export default Auth;