import React from 'react';
import Showmodel from "./Showmodel";

function PostItem({data}) {
    return (
        <div className='d-flex my-4'>
            <div className='postImg'>
<img src={data.picture} alt={data.itemName}/>
            </div>
            <div className='postContent'>
                <div className='text'>
    {
        data.description.slice(0,30)+'....'
    }    
                </div>
                <Showmodel data={data}/>

            </div>
            
        </div>
    );
}

export default PostItem;