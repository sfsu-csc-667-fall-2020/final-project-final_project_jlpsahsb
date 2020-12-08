import React from 'react';
import PostItem from "./PostItem";
function PostCatg({data}) {
    return (
        <div>
<h4 className='c-catgories mb-4'>
{data.catgName}
</h4>
<div>
{
    data.data.map((i,index)=>{
        return <PostItem data={i} key={index}/>
    })
}
</div>
        </div>
    );
}

export default PostCatg;