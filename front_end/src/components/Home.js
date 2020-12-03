import React, { useEffect, useState } from 'react';
import NavBar from "./NavBar";
import PostCatg from './PostCatg';
import SideNav from './SideNav';
import service from "../data/service";

function Home(props) {
    const [projectdata, setprojectdata] = useState([])
    useEffect(() => {
        setprojectdata(service.getData())
    }, [projectdata])
    return (
        <div>
            <NavBar />
            <div className='container mt-5'>

                <div className='row'>
                    <div className='col-md-6 offset-md-6 mb-3'>
                        <div className='d-flex justify-content-end'>
                        <div className='form-group mb-0 mr-2'>
                            <input className='form-control' placeholder='Search here' />
                        </div>
                        <button className='btn btn-primary'>Search</button> 
                        </div>
                    </div>
                    <div className='col-12 col-md-12'>
                        <div className='mainDataDiv'>
                            {
                                projectdata.map((i, index) => {
                                    return <PostCatg key={index} data={i} />
                                })
                            }
                        </div>
                    </div>
                    {/* <div className='col-12 col-md-4 col-lg-3'>
                        <SideNav />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Home;