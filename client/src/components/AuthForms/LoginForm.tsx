import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";

type InputType = {
  
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

const LoginForm: React.FC<InputType> = ({
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <AuthLayout>
      <div className="w-full px-[2vh] mx:px-0 flex items-center justify-center">
        <form className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
