import {useState, useEffect, useRef, useMemo} from 'react';
import {v4} from 'uuid';
import '../styles/UserForm.css'
import '../styles/Form__Err-msg.css'
import '../styles/Form__Success-msg.css'

function UserForm() {
    //Username: State, Foucs, Valid
    const [user, setUser] = useState('');
    const [userFocus, setUserFocus] = useState('false');
    const [userValid, setUserValid] = useState('false');
    //Other info
    const user_REGEX =useMemo(()=>/^.{1,25}$/,[])
    const email_REGEX = useMemo(()=>/^(?!@)(?=.*@)[\s\S]{1,50}$/,[])
    const desc_REGEX =useMemo(()=>/^.{1,200}$/,[])
    const age_REGEX =useMemo(()=>/^[0-9]{1,3}$/,[])
    const resumeLink_REGEX =useMemo(()=>/^.{1,200}$/,[])

    //Email-address: State, Focus, Valid
    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState('');
    const [emailValid, setEmailValid] = useState(false);

    //Description: State, Focus, Valid
    const [desc, setDesc] = useState('');
    const [descFocus, setDescFocus] = useState(false);
    const [descValid, setDescValid] = useState(false);

     //Age: State, Focus, Valid
     const [age, setAge] = useState('0');
     const [ageFocus, setAgeFocus] = useState(false);
     const [ageValid, setAgeValid] = useState(true);
     
     //ResumeLink: State, Focus
     const [resumeLink, setResumeLink] = useState('NA');
     const [resumeLinkFocus, setResumeLinkFocus] = useState(false);
     const [resumeLinkValid, setResumeLinkValid] = useState(false)

    //Hidden state
    const [hidden,setHidden] = useState(true);

    //success
    const [successMsg,setSuccessMsg] = useState('');

    function handleHidden(){
        if(hidden){
            setHidden(false);
        }else{
            setHidden(true);
        }
        console.log(hidden);
    }

    //Current Date
    const [currentDate, setCurrentDate] = useState('');
    useEffect(()=>{
        const currentDateObj = new Date();
        const date = currentDateObj.toDateString();
        setCurrentDate(date);
    },[])

    //Potential Error Message
    const [errorMsg,setErrorMsg] = useState('');

    useEffect(()=>{
        setErrorMsg('');
    },[user,email, desc])
    
    useEffect(()=>{
        if(successMsg===''){
            return;
        }  setTimeout(()=>{
            setSuccessMsg('');
        },4000)
    },[successMsg])

    useEffect(()=>{
        setUserValid(user_REGEX.test(user));
    },[user,user_REGEX])

    useEffect(()=>{
        setEmailValid(email_REGEX.test(email));
    },[email,email_REGEX])

    useEffect(()=>{
        setDescValid(desc_REGEX.test(desc));
    }, [desc,desc_REGEX])

    useEffect(()=>{
        setAgeValid(age_REGEX.test(parseInt(age)));
    }, [age,age_REGEX])

    useEffect(()=>{
        setResumeLinkValid(resumeLink_REGEX.test(resumeLink))
    },[resumeLink,resumeLink_REGEX])

    //Reference to user input to assign auto focus
    const userRef = useRef();
    useEffect(()=>{
        userRef.current.focus();
    },[])

    const emailRef = useRef();
    const descRef = useRef();
    const ageRef = useRef();
    const resumeRef= useRef();

   
    //For JSON Server run this command in the terminal: npx json-server --watch data_base/db.json --port 8000
    const handleSubmit =  async (e) => {
        e.preventDefault();
        //if button enabled with JS hack
        const v1 = user_REGEX.test(user);
        const v2 = email_REGEX.test(email);
        const v3 = desc_REGEX.test(desc);
        const v5 = age_REGEX.test(parseInt(age));
        const v6 = resumeLink_REGEX.test(resumeLink);
        if (!v1|| !v2 || !v3 || !v5 || !v5 ||!v6){
        setErrorMsg("Invalid Entry: Check inputs for errors");
        return;
         }
         let data = {
            username: user,
            email: email,
            role: "user",    //hard-coded value. If project were expanded upon, would add an option for users with the 'admin' role to give other roles to users.  
            registration_date: currentDate ,
            age: age,
            resume_link: resumeLink ,
            id: v4(),
            desc: desc,
         }
         userRef.current.value =''; setUser('')
         emailRef.current.value=''; setEmail('')
         descRef.current.value='';   setDesc('')
         ageRef.current.value='';   setAge('0')
         resumeRef.current.value=''; setResumeLink('NA');
        try{
            await fetch('http://localhost:8000/users',{
                method: 'POST',
                headers: {
                    'Content-Type': 'applicaiton/json',
                },
                body: JSON.stringify(data),
            })
            setSuccessMsg('['+data.username+'] created')
           } catch (err){
            console.log('we registred the catch statemnt')
            setErrorMsg('Could not connect to server');
        }
    }
    //show error
    useEffect(()=>{
        if(errorMsg===''){
            return
        }
        setTimeout(()=>{
            setErrorMsg('');
        },4000)
    },[errorMsg])



return(
    <>
    
    <form onSubmit={handleSubmit} className="NewUser__Form" name="user__form"  >
        <div className="innerForm__group">
                <label htmlFor="username">Username:{userValid? '':<bold>*</bold>}</label>
                <input type="text" 
                id="username"
                ref={userRef}
                autoComplete='off'
                onChange={(e)=> setUser(e.target.value)}
                required
                onFocus={()=>setUserFocus(true)}
                onBlur={()=>setUserFocus(false)}    //Redundent, or part of controlled componenets? 
                />
                <p className={userFocus && !userValid && user!=='' ? "instructions" : "no"}>  
                Username must be anywhere from 1-25 characters.
                 </p>
            </div>
            <div className="innerForm__group">
                <label htmlFor="email">Email:{emailValid? '':<bold>*</bold>}</label>
                <input type="text" 
                id="email"
                autoComplete='off'
                onChange={(e)=> setEmail(e.target.value)}
                ref={emailRef}
                required
                onFocus={()=>setEmailFocus(true)}
                onBlur={()=>setEmailFocus(false)}
                />
                <p className={emailFocus && !emailValid && email!=='' ? "instructions" : "no"}>  
                Max of 50 char. Must contain @
                 </p>
            </div>
            <div className="innerForm__group">
                <label htmlFor="description">Description:{descValid? '':<bold>*</bold>}</label>
                <input type="text" 
                id="email"
                autoComplete='off'
                onChange={(e)=> setDesc(e.target.value)}
                required
                onFocus={()=>setDescFocus(true)}
                onBlur={()=>setDescFocus(false)}
                ref={descRef}
            />
             <p className={descFocus && !descValid && desc!=='' ? "instructions" : "no"}>  
                Max of 200 char.
                 </p>
            </div>
            <div className={hidden ? "no": "innerForm__group"}>
                <label htmlFor="age">Age:{age==='' || ageValid ? '':<bold>*</bold>}</label>
                <input type="text" 
                id="age"
                autoComplete='off'
                onChange={(e)=> setAge(e.target.value)}
                onFocus={()=>setAgeFocus(true)}
                onBlur={()=>setAgeFocus(false)}
                ref={ageRef}
            />
             <p className={ageFocus && !ageValid && age!=='' ? "instructions" : "no"}>  
                Must be a number smaller than 4 digits.
                 </p>
            </div>
            <div className={hidden ? "no": "innerForm__group"}>
                <label htmlFor="resumeLink">Link to Resume:{resumeLink==='' || resumeLinkValid ? '':<bold>*</bold>}</label>
                <input type="text" 
                id="resumeLink"
                autoComplete='off'
                onChange={(e)=> setResumeLink(e.target.value)}
                onFocus={()=>setResumeLinkFocus(true)}
                onBlur={()=>setResumeLinkFocus(false)}
                ref={resumeRef}
            />
             <p className={resumeLinkFocus && !resumeLinkValid && resumeLink!=='' ? "instructions" : "no"}>  
                Max of 200 char.
                 </p>
            </div>
            <div className='NewUserbtn__group'>
            <button className="NewUser__submit" type='submit'>Create User</button>
            <button className='NewUser__advanced' type='button' onClick={handleHidden} >{hidden? "Advanced Options":"Hide Advanced Options"}</button>
            </div>
    </form>
    <div className={errorMsg===''?'no': 'Form__Err-msg'}>
        <h1>ERROR</h1>
        <p>{errorMsg}</p>
    </div>
    <div className={successMsg===''?'no': 'Form__Success-msg'}><p>{successMsg}</p></div>
    </>
);

}

export default UserForm;