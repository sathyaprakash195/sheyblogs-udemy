import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { LoginUser } from "../../apicalls/users";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Login() {
  const dispatch = useDispatch();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      dispatch(ShowLoading())
      const response = await LoginUser(user);
      if (response.success) {
        localStorage.setItem("token", response.data);
        window.location.href = "/";
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading())
    } catch (error) {
      dispatch(HideLoading())
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center bg-primary">
      <div className="bg-white p-5 w-[450px]">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center text-primary uppercase">
            SHEYBLOGS - Login
          </h1>

          <input
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <Button
            title="Login"
            onClick={login}
            disabled={user.email.length < 3 || user.password.length < 3}
          />

          <Link to="/register" className="text-center text-primary underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
