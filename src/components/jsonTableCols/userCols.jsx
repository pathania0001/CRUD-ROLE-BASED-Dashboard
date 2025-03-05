
// import EditData from "../actions/editData";
// import DeleteData from "../actions/deleteData";
// import Persona from "../../utils/persona";
// import { dateFormat } from "../../../../constants";

import OtherTask from "../actions/otherTask";

export const userCols = [
    // {
    //     name: "actions", sticky:true , checked: true, cell: (properties) => {
    //         return <div className='flex justify-center gap-2 p-4 '><ViewData data={properties} type={"clinician"} />
    //          </div>

    //     }
    // }
    {
        name: "Email", checked: true, accessor: "email", cell: (properties) => (
            <div className='flex gap-3 items-center p-2'>
                <span className="lowercase">{properties?.email}</span>
            </div>
        )
    },
   
    {
        name: "Creation", checked: true, accessor: "creation", cell: (properties) => {
            return <span className=''>{properties?.creation ? "Yes": "No"}</span>

        }
    },
    {
        name: "actions",sticky:true, checked: true, cell: (properties) => {
            //console.log("user for action...",properties);
            return <div className='flex justify-center gap-2 p-4 '>
            {/* <ViewData data={properties}/>   */}
              <OtherTask properties={properties}/>          
             </div>

        }
    }
   
 
  
]