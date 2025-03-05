import React, { useEffect, useMemo } from 'react'

import { Eye } from 'lucide-react'
import Modal from '../utils/Modal'
import moment from "moment";
import useGlobal from './../../hooks/useGlobal';

const ViewData = ({ type, data }) => {
    
   const {user,actionPermission} = useGlobal();
   //console.log("data :",data )

    return (
        <>
        
        <Modal className={`${type === "blog" && "md:max-w-[70%]"} `} 
       openCTA={<span title="View"> <Eye className='w-5 text-green-700' /> </span>}  
       heading={"View Details"} 
       firstCtaText={"Close"} >

    <ul>
        
        {/* Title */}
        {( user.role ==="admin" ||  data?.title ) && (
            <li className="p-2 border-b">
                <span className="font-bold capitalize">Title:</span> {data?.title}
            </li>
        )}

        
        {(   user.role ==="admin"|| data?.desc && actionPermission[data.id]?.desc ) && (
            <li className="p-2 border-b">
                <span className="font-bold capitalize">Description:</span> {data?.desc}
            </li>
        )}
      
        {(user.role ==="admin" || data?.location && actionPermission[data.id]?.location) && (
            <li className="p-2 border-b">
                <span className="font-bold capitalize">Location:</span> {data?.location}
            </li>
        )}

      
        {data?.status && actionPermission[data.id]?.status && (
                <li className="p-2 border-b">
                    <span className="font-bold capitalize">Status:</span> {data.status}
                </li>
            )}


       
        {user.role==="admin" && (data?.permissions?.length > 0 && (
            <li className="p-2 border-b">
                <span className="font-bold capitalize">Permissions:</span>
                {data?.permissions?.map((item, i) => (
                <div key={i} className=" p-2 ">
                        <p><b>Email:</b><span className='lowercase px-1'>{item.name}</span></p>
                        <p><b>Edit:</b> {item.edit ? "Yes" : "No"}</p>
                        <p><b>Delete:</b> {item.delete ? "Yes" : "No"}</p>
                        <p><b>View:</b> {item.view ? "Yes" : "No"}</p>
                    </div>
                
                 
                ))}
            </li>
        ))}

        
        {data?.createdAt?.seconds && (
            <li className="p-2 border-b">
                <span className="font-bold capitalize">Created At:</span> {moment.unix(data.createdAt.seconds).format("YYYY-MM-DD HH:mm:ss")}
            </li>
        )}
        
    </ul>

</Modal>


        </>
    )
}

export default ViewData