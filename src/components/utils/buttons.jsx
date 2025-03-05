import { useState } from "react"
import MiniLoader from "./miniLoader"

// eslint-disable-next-line react/prop-types
const Buttons = ({ type = "primary", children, spinner = true, disabled, big = false, className, onClick }) => {
  const [loading, setLoading] = useState(false)
  const handleClick = async () => {

    setLoading(true)
    onClick && await onClick()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  return (
    <>
      <button disabled={disabled} onClick={handleClick} className={`relative rounded ${big ? "text-lg px-8 py-2" : "text-sm py-1 px-4"}  ${type === "border" ? "text-primary  border border-primary border-solid disabled:opacity-70 disabled:text-desc" : type === "danger" ? "bg-red-500 text-white" : "bg-primary text-white"} select-none ${className} disabled:opacity-50`}>
        {
          spinner &&
          <span className="absolute left-2 top-3">
            {
              loading && <MiniLoader />
            }
          </span>
        }
        {children}
      </button>
    </>
  )
}

export default Buttons