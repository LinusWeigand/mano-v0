
"use client";
import { useRouter } from "next/navigation";
import Login from "../components/auth/login";
import Start from "../components/auth/start/start";
import { useState } from "react";
import Register from "../components/auth/register";

enum AuthState {
  Start, Login, Register
}

export default function LoginPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState(AuthState.Start);
  const [email, setEmail] = useState("");


  return (
    <div className="flex flex-col  min-h-screen relative">
      <div className="flex justify-center h-full items-center m-w-screen border-t border-[#ddd] flex-grow">
        {authState === AuthState.Start
          ? <Start
            on_close={() => router.push("/")}
            to_login={(email) => {
              setAuthState(AuthState.Login);
              setEmail(email);
            }}
            to_register={(email) => {
              setAuthState(AuthState.Register);
              setEmail(email);
            }} />
          : authState === AuthState.Login
            ? <Login
              on_close={() => router.push("/")}
              to_forgot_password={() => router.push("/forgot-password")}
              to_start={() => setAuthState(AuthState.Start)}
              email={email}
            />
            : <Register
              on_close={() => router.push("/")}
              to_start={() => setAuthState(AuthState.Start)}
              email={email}
            />
        }
      </div>
    </div >
  );
}
