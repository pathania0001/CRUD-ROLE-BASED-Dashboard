import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import useGlobal from "../../hooks/useGlobal";

const MultiSelect = ({
  label,
  className,
  users, 
  handleUserSelection,
  selectedUsers, 
  isDisable=false
}) => {

  const {role,user} = useGlobal();

console.log("isDisablked", isDisable)
  const handleUserChange = (e) => {
    const userId = e.target.value;
    if (userId && !selectedUsers?.some((u) => u.id === userId)) {
      const user = users.find((u) => u.id === userId);
      handleUserSelection((prevUsers) => [
        ...(prevUsers || []), 
        { ...user, view: false, edit: false, delete: false, desc: false, location: false, status: false },
      ]);
      
    }
  };
  
  const handlePermissionChange = (userId, permission) => {

    handleUserSelection((prevUsers) =>
      prevUsers?.map((user) => {
        if (user.id === userId) {
          const updatedUser = { ...user, [permission]: !user[permission] };
    
          if (permission === "view" && !updatedUser.view) {
            updatedUser.location = false;
            updatedUser.status = false;
            updatedUser.desc = false;
        }
        
        
    
          return updatedUser;
        }
        return user;
      })
    );
    
  };
  

  const removeUser = (userId) => {
    handleUserSelection(selectedUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className={`${className} space-y-2 w-full normal-case`}>
      {label && <label className="capitalize font-medium block whitespace-nowrap">{label}</label>}

      {/* Multi-Select Dropdown */}
      <select  
      onChange={handleUserChange}  
      disabled={isDisable} 
      value={""}
      className={`block w-full bg-transparent p-2 border border-gray-200 rounded-xl text-desc `}>
        <option value="">Select Users</option>
        {users?.map((user) => (
          <option key={user?.id} value={user?.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Selected Users & Permissions */}
      <div className="mt-3 space-y-2">
       {selectedUsers?.map((user) => (
    <div
      key={user?.id}
      className="flex items-center justify-between border p-2 rounded-lg bg-gray-100"
    >
      <span className={`${role === "user"?"text-black/70":""}`}>{user?.name}</span>
      <div className="flex gap-2">
        {["view", "desc", "status", "location", "edit", "delete"].map(
          (perm) =>
            (["desc", "status", "location"].includes(perm) &&
              !user?.view) ? null : (
              <label key={perm} className={`flex items-center gap-1 ${isDisable && "text-black/70 " }`}>
                <input
                  type="checkbox"
                  checked={user[perm] || false}
                  onChange={() => handlePermissionChange(user?.id, perm)}
                  disabled={role === "user" && isDisable}
                />
                {perm?.charAt(0).toUpperCase() + perm?.slice(1)}
              </label>
            )
        )}
       { (role === "admin" || !isDisable) && <button onClick={() => removeUser(user?.id)} className="text-red-500">
          <Trash />
        </button>}
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default MultiSelect;
