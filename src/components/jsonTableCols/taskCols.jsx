import ViewData from "../actions/viewData"


import { Link } from "react-router-dom"
import { Edit } from "lucide-react"
import OtherTask from "../actions/otherTask"

export const taskCols = [
 {
        name: "Title", checked: true,  accessor: "title", cell: (properties) => (
            <div className='flex gap-3 items-center p-2'>
                <span className="truncate">{properties?.title}</span>
            </div>
        )
    },
   
    {
        name: "Description", checked: true, accessor: "desc", cell: (properties) => {
            return <span className='lowercase'>{properties?.desc || "-"}</span>

        }
    },
    {
        name: "Status", checked: true, accessor: "status", 
    },
    {
        name: "Location", checked: true, accessor: "location", 
    },
    {
        name: "actions",sticky:true, checked: true, cell: (properties) => {
           
            return <div className='flex justify-center gap-2 p-4 '>
            <ViewData data={properties}/>  
            <OtherTask properties={properties}/>          
             </div>

        }
    }
 
  
]