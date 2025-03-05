import { Delete, Edit, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useGlobal from '../../hooks/useGlobal'
import Modal from '../utils/Modal'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'

import { deleteUser } from 'firebase/auth'
import { getAuth } from 'firebase/auth/cordova'

const OtherTask = ({ properties }) => {
    const [permissions, setPermissions] = useState(null)
    const { user, success, error, render, setRender,role } = useGlobal()
    useEffect(() => {
        const perm = properties?.permissions?.find(q => q.id === user?.email)
        setPermissions(perm)
    }, [user])
    const handleDelete = async () => {
        //console.log("deleteuser:",user)
        if(!properties.role)
        {
        try { 
            
        if (!properties?.id) {
        error("Invalid task ID!");
        return;
        }

            const taskDocRef = doc(db, "tasks", properties?.id);
            await deleteDoc(taskDocRef);

            console.log("Task deleted successfully!");
            success("Task deleted successfully!");
            setRender(!render)

        } catch (err) {
            error("Error deleting task:");
            console.error("Error deleting task:", err);
        }}
    
    };

    return (
        <>
            {
               (properties?.user && role==="admin") &&
                <Link to={`/dashboard/user/${properties?.user}`}><Edit className='w-5 text-blue-700' /></Link>

            }
            {
               (permissions?.edit || role==="admin" && !properties?.user) &&
                <Link to={`/dashboard/task/${properties?.id}`}><Edit className='w-5 text-blue-700' /></Link>

            }
            {
                (permissions?.delete   || role==="admin") &&
                <>

                    <Modal openCTA={<Trash className='w-5 text-red-700' />} firstCtaText={"Cancel"} secondCtaText={"Delete"} handleSecondCta={handleDelete} >
                        <p className='text-center normal-case'>Are you sure to delete this task</p>
                    </Modal>
                </>

            }
        </>
    )
}

export default OtherTask