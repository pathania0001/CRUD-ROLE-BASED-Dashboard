import { Eye, EyeOff, Trash } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { dateFormat } from "../../../constants";

const InputField = ({
  label,
  className,
  isDisable,
  options,
  deleteCta,
  type = "text",
  id,
  value,
  max,
  handleInputChange,
  handleEditorChange,
  placeholder = "",
  checked, prefix = false,
  subLabel=false,
}) => {
  const [showPass, setShowPass] = useState(false)


  const handleChange = (e) => {
    const { type, value } = e.target
    if (type === "tel") {
      const numericValue = value.replace(/[^0-9]/g, '');
      e.target.value = numericValue
    }
    if(type==="checkbox"){
      //
    e = {...e, target: {...e.target, value: e.target.checked,name:e.target.name}}
    
    }
    handleInputChange && handleInputChange(e)
  }
  return (
    <>
      <div className={`${className} ${(type === "textarea" || type === "textEditor") ? "md:col-span-2 xl:col-span-3" : type === "checkbox" ? "flex  gap-1 items-center" : "space-y-2 w-full "} normal-case`}>
        {label && (
          <label className={`capitalize font-medium block whitespace-nowrap ${isDisable ?"text-black/70":""}`} htmlFor={id}>
            {label}
          </label>
        )}
        {
          type === "select" ? (
            <select
              value={value}
              onChange={handleInputChange}
              name={id}
              id={id}
              disabled={isDisable}
              className="block w-full bg-transparent p-2 border border-gray-200 placeholder:font-light focus:outline-primary rounded-xl text-desc">
              {options?.map((option, key) => {
                return (
                  <option key={key} disabled={option?.disable} selected={option?.selected}   value={option?.value}>
                    {option?.name}
                  </option>
                );
              })}
            </select>
          ) : type === "textarea" ? (
            <textarea
              id={id}
              name={id}
              value={value}
              placeholder={placeholder}
              onChange={handleInputChange && handleInputChange}
              className="bg-transparent p-3 text-desc  placeholder:font-light border border-gray-200 focus:outline-primary rounded-xl w-full   "></textarea>
          )
            : type === "switch" ?
              <label className="flex justify-end  cursor-pointer text-right">
                <input type="checkbox" name={id} id={id} onChange={handleInputChange} checked={value} className="sr-only peer" />
                <div className="relative text-desc  w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
              </label>

              : (
                  <div className="flex border-2 items-center border-gray-200 rounded-xl focus-within:border-2 focus-within:border-primary">
                    {
                      prefix && prefix()
                    }
                    <input
                      id={id}
                      type={type === "password" ? (showPass ? "text" : "password") : type}
                      name={id}
                      value={(type === "file" ? null : type === "date" ? moment(value)?.format(dateFormat) : value)}
                      placeholder={placeholder}
                      checked={checked}
                      maxLength={type === "tel" ? max : undefined}
                      pattern={type === "tel" ? "[0-9]*" : undefined}
                      inputMode={type === "tel" ? "numeric" : undefined}
                      accept={type === "file" ? "image/*" : undefined}
                      onChange={handleChange}
                      className={`accent-primary text-desc bg-transparent leading-0 p-1 sm:p-2 w-full placeholder:font-light placeholder:text-sm focus:outline-none  disabled:bg-gray-200 ${type !== "password" ? "rounded-xl" : "rounded-l-xl"}`}
                      disabled={isDisable}
                    />

                    {
                      deleteCta && <div onClick={deleteCta} className=" cursor-pointer bg-red-500 p-2 rounded-r-xl text-white">

                        <Trash />
                      </div>
                    }
                    {type === "password" &&
                      <button type="button" onClick={() => setShowPass(!showPass)} className="bg-primary text-white cursor-pointer p-2 rounded-r-lg">
                        {showPass ? <Eye /> : <EyeOff />}
                      </button>
                    }
                  </div>


                )}

      </div>
    </>
  );
};

export default InputField;
