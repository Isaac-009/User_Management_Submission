import {useState,useEffect} from 'react';
import '../styles/UserView.css';
import Pagination from './Pagination'

function UserView(){

    const [data,setData] = useState(null); //data from api
    //const [upp,setUPP] = useState(10);  //upp- users per page
    const [currentPage, setCurrentPage] = useState(1); //page of the table
    const [length, setLength]= useState();  //length of data (after filter)
    const [length2, setLength2] = useState(); //length of data (before filter)
    const [index, setIndex] = useState(0);    //row index
    const [modal,setModal] = useState(false);  //modal window
    const [filter,setFilter] = useState('');  //filter input
    const [fData,setFData] = useState('');    //filtered data
    const [order,setOrder] = useState('ASC'); //sorting order
    const [confirm,setConfirm] = useState(false);  //confirm window
    const [errMsg,setErrMsg] = useState('');
    const upp = 10; //upp-users per page
    const lastPostIndex = currentPage * upp;   //Index for last post (0-upp)
    const firstPostIndex = lastPostIndex-upp;  //Index for first post (upp-infinity)

    //Run on mount, fetch data from the API    
    useEffect(() =>{
      const fetchData = async () => {
        try{
            const response = await fetch('http://localhost:8000/users')  //returns a response object
            if (!response.ok){   //did the network respond properly?
                throw new Error('No network response')
            }
            const data2 = await response.json(); //data
            setData(data2)  
            setLength(data2.length)
            setLength2(data2.length)
        } catch (error) {
           setErrMsg('Could not connect to server')
        }
    };
        fetchData(); //invoke  
},[])  //only run on mount

//Remove the error message after 4000ms
useEffect(()=>{
    if(errMsg===''){
        return;
    }  setTimeout(()=>{
        setErrMsg('');
    },4000)
},[errMsg])

    //delete the user
   function deleteUser(index){
    console.log(fData[index].id)
    fetch('http://localhost:8000/users/'+fData[index].id, {method: 'DELETE'})
    setModal(false);
    setConfirm(false);
    setLength(length-1);
    setLength2(length2-1)
    setData(data.filter(item => item.id !==fData[index].id))
   }

  async function openModal(index){
        setIndex(index)
        setFData(data.filter((item) =>{
            return filter.toLowerCase() === '' ? item: item.username.toLowerCase().includes(filter.toLowerCase())
        }).slice(firstPostIndex,lastPostIndex))
        setModal(true);
    }

    function closeModal(){
        setModal(false);
    }
   
    function sorting(col){
        console.log(order)
        if (order === "ASC"){
            const sorted = [...data].sort((a,b)=>{
       return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1});
        setData(sorted);
        setOrder("DESC")
    }      if (order === "DESC"){
        const sorted = [...data].sort((a,b)=>{
   return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1});
    setData(sorted);
    setOrder("ASC")
}
    }


    /*change the length when the filter changes.This ensures that the 
     pagination buttons disappear based on the length of the filtered data*/
    useEffect(()=>{
        if(filter==='')
            setLength(length2)
        else{
            setLength(data.filter((item) =>{
                return filter.toLowerCase() === '' ? item: item.username.toLowerCase().includes(filter.toLowerCase())
            }).length)
        }
    }
,[filter,data,length2])

    //for the filter input field. Sets page to 1 and setFilter
    function handleChange(input){
        setFilter(input)
        if (currentPage!==1){
            setCurrentPage(1)
        }
    }

return(
    <div>
        {errMsg && <div className='Form__Err-msg'><h1>Error</h1><p>{errMsg}</p></div>}
        {data !=null && data.length!==0 && 
            <><section className="Grid__Container">
                <article className="User__Grid" >
                    <div className="User__Row">
                        <div className="User__Item1" onClick={()=> sorting("username")}>username</div>
                        <div className="User__Item2">email</div>
                        <div className="User__Item3">desc</div>
                    </div>
                    {data.filter((item) =>{
                        return filter.toLowerCase() === '' ? item: item.username.toLowerCase().includes(filter.toLowerCase())
                    }).slice(firstPostIndex,lastPostIndex).map((user,index) =>(
                        <div className="User__Row" key={index}>
                        <div className="User__Item1" >{user.username}</div>
                        <div className="User__Item2">{user.email.substring(0,20)}</div>
                        <div className="User__Item3">{user.desc.substring(0,55)}</div>
                        <button className="User__btn"  onClick={()=> openModal(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="info__svg" key={currentPage} >
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        </div>
                    ))}
                </article>
            </section>
            <Pagination clasName="View__Pagination" totalPosts={length} upp={upp} setCurrentPage={setCurrentPage}>
            </Pagination>
            <input className='User__filter' type="text" placeholder="Filter" onChange={(e) => handleChange(e.target.value)} />
            </>
        }

            {modal && <section>
                        <div className='overlay'>
                            <div className="Modal__container">
                         <article className="User__modal">
                            <h1 className={confirm ?'no':'Modal__title'}>{fData[index].username}</h1>
                            <p className={confirm ?'no':'Modal__info'}>Description: {fData[index].desc}</p>
                            <p className={confirm ?'no':'Modal__info'}>Role: {fData[index].role}</p>
                            <p className={confirm ?'no':'Modal__info'}>Registration Date: {fData[index].registration_date}</p>
                            <p className={confirm ?'no':'Modal__info'}>Email Address: {fData[index].email}</p>
                            <p className={confirm ?'no':'Modal__info'}>Age: {fData[index].age}</p>
                            <p className={confirm ?'no':'Modal__info'}>Link to Resume: {fData[index].resumeLink}</p>
                            <div className={confirm ?'no':'Modal__btn-flex'}>
                            <button onClick={()=>closeModal()} className='close__btn'>Close</button>
                            <button className='remove__btn' onClick={()=>setConfirm(true)}>Remove User</button>
                            </div>
                            {confirm && <section className="Confirmation__window">
                        <h1>Are you sure?</h1>
                        <p>This action cannot be undone.</p>
                        <div className='conf__btns'>
                            <button onClick={()=>deleteUser(index)} className='Yes__btn'>Yes</button>
                            <button className='No__btn' onClick={()=>setConfirm(false)}>No</button>
                        </div>
                </section>}
                         </article>
                            </div>
                         </div>
                         </section> 
                        }
    </div>

);

  
}




export default UserView;