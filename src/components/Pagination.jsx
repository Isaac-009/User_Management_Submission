import React from 'react'

function Pagination({totalPosts,upp, setCurrentPage}){
    let pages = [];
    for(let i= 1; i<= Math.ceil(totalPosts/upp); i++)
        pages.push(i)
    
    return(
       <div className="p__btn-grid">
        {
            pages.map((page, index)=>{
             return <button className='p__btn' key={index} onClick={() => setCurrentPage(page)}>{page}</button>    
              })
        }
        </div>
    );
}

export default Pagination