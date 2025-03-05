import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Card from "../components/utils/card"
import { ArrowLeft } from "lucide-react";
import InputField from "../components/utils/InputFields";
import Buttons from "../components/utils/buttons";
import OtpInput from "../components/utils/OTP";
import useGlobal from "../hooks/useGlobal";
import { validateEmail } from "../functions/emailValidator";
import { login } from "../functions/login";

const loginInput = [
  {
    label: "Email Address",
    id: "email",
    type: "text",
    placeholder: "Enter your email"
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Password",
  }
];



const resetPass = [

  {
    id: "newPassword",
    label: "password",
    type: "password",
    placeholder: "Enter new password",
  },
];

const Login = ({ type }) => {
  const navigate = useNavigate()
  const { success, error, setUser, setMainLoader, disable, setDisable } = useGlobal();
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    emailForReset: "",
    newPassword: "",
    otp: ""
  });
  const [items, setItems] = useState([])
  const [otpBlock, setOtpBlock] = useState(false)
  const [page, setPage] = useState(type)
  const [forgotToken, setForgotToken] = useState("")

  function handleInput(event) {

    setInputValues((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    setMainLoader(true)
    if(type === "login" || type === "register") {
       setItems(loginInput)
       setPage("login")
      } else{
        setPage("resetPass")
        setItems(resetPass);
      } 
    const token = localStorage.getItem('token')
    token && navigate("/dashboard/task");
    setMainLoader(false)

  }, [type])

  const handleLogin = async () => {

    const { email, password } = inputValues;

    if (!email || !password) {
      error("Both email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      error("Please enter a valid email address.");
      return;
    }

    try {
      setMainLoader(true);
      // 
      const  data  = await login(email, password);
      // console.log("data :",data)
      
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("uid", data.uid);
      setUser(data);
      setInputValues(null)
      success("Login succesfully");
      navigate("/dashboard/task");
    } catch (err) {
      console.error("Error during login:", err);
      error(err.message);
    } finally {
      setMainLoader(false);
    }
  };


  const handleOtpVerify = async () => {
    setDisable(true)
    try {
      if (!inputValues || !inputValues.emailForReset || !inputValues.otp) {
        throw new Error("Email and Otp is required to reset the password");
      }
      const { data } = await apiHandler.post("otp-verify", { email: inputValues?.emailForReset, otp: inputValues?.otp })
      success(data.message);
      setForgotToken(data?.data)


    } catch (err) {
      console.error("Error during password reset:", err);
      error(err.message || "An error occurred during password reset");
    }
    setDisable(false)

  };
  const handleResetPassword = async () => {
    setDisable(true)
    try {
      if (!inputValues || !inputValues.emailForReset) {
        throw new Error("Email is required to reset the password");
      }

      const { data } = await apiHandler.post("/otp", { email: inputValues.emailForReset, type: "forgot" });
      success(data.message);
      setOtpBlock(true)

    } catch (err) {
      console.error("Error during password reset:", err);
      error(err.response?.data?.message || err.message || "An error occurred during password reset");
    }
    setDisable(false)

  };
  const handlePassword = async () => {
    const finalTemp = {
      password: inputValues?.newPassword,
      email: inputValues?.emailForReset
    }

    try {
      if (!finalTemp || !finalTemp.email || !finalTemp.password) {
        throw new Error("Email is required to reset the password");
      }

      const { data } = await apiHandler.put("forgot-password", finalTemp, {
        headers: {
          'x-token': forgotToken,

        }
      })


      success(data.message);
      setForgotToken("")
      navigate("/dashboard/task")

    } catch (err) {
      console.error("Error during password reset:", err);
      error(err.response?.data?.message || err.message || "An error occurred during password reset");
    }
    setDisable(false)

  }




  return (
    <>
      <div className={`flex flex-col h-screen items-center justify-center bg-primary-light p-4`}>


        <Card className={` !max-w-[420px] !w-full !pt-3 `} title={


          <div className="normal-case  my-2">
            {page === "resetPass" && <ArrowLeft className="inline float-start  cursor-pointer mt-1" onClick={() => { navigate("/"); setOtpBlock(false) }} />}
            <h6 className="text-center text-2xl  ">{page === "login" ? "Sign in " : "Forgot Password"}</h6>


          </div>


        } desc={
          page === "login" &&
          <p className="text-center">
            Enter your email and password to login
          </p>
        }>
          

              <div className="py-4 space-y-4">
                {
                  items?.map((ele, index) => {
                    return <InputField key={index} handleInputChange={handleInput} id={ele?.id} label={ele.label} type={ele.type} value={inputValues?.[ele.id]} placeholder={ele.placeholder} />
                  })
                }
                <div>
                  <Buttons spinner={false} onClick={type === "login" ? handleLogin : handlePassword} big={true} className={"w-full "}>{type === "login" ? "Sign in" : "Update"}</Buttons>
                </div>
              </div>
         
        </Card>
      </div>
    </>
  )
}

export default Login
