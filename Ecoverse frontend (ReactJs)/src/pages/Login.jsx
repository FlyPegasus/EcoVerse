import React, { useState } from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // kyu use kiya ye? SignUp dekh

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpHandler = async (e) => {
    e.preventDefault(); // form submit yani new page jump hone se rokega
    console.log(input); // useState variable hai dhyan se dekh
    // backend api connect
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ye kya hai?
        }
      );
      console.log(res);
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message); // toast ek pop up animation hai
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const changeEventHandler = async (e) => {
    // iska kaam kya hai?
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signUpHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div>
          <h1 className="text-center font-bold text-xl">Logo</h1>
          <p className="text-sm text-center">Login to Ecoverse!!</p>
        </div>
        <div>
          <Label className="py-1 font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          ></Input>
        </div>
        <div>
          <Label className="py-1 font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          ></Input>
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Create Account
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
