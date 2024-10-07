"use client";

import { ChevronLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface LoginProps {
    to_start: () => void;
    to_forgot_password: () => void;
    on_close: () => void;
    email: string;
}

export default function Login({ to_start, to_forgot_password, on_close, email }: LoginProps) {
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("E-Mail: ", email);
        console.log("Password: ", password);
        try {
            const response = await fetch("http://localhost/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to login");
            }
            on_close();
            console.log("Logged in")
        } catch (error) {
            console.error("Error occured in handleLogin: ", error);
        }
    };

    return (
        <Card className="relative w-screen sm:w-[550px] py-6">
            <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
                <div onClick={to_start} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
                    <ChevronLeft />
                </div>
                <p>Log in</p>
            </div>
            <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
                <label
                    htmlFor="UserPassword"
                    className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
                >
                    <input
                        type="password"
                        id="UserPassword"
                        placeholder="Password"
                        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                        onChange={(e) => setPassword(e.target.value)}

                    />

                    <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                        Password
                    </span>
                </label>

                <button
                    className="flex items-center justify-center rounded-lg text-white p-4 mt-4 WeiterButton"
                    onClick={handleLogin}
                >
                    Anmelden
                </button>

                <p className="text-md text-left underline mt-4 text-black hover:underline cursor-pointer" onClick={to_forgot_password}>
                    Forgot password?
                </p>
            </div>
        </Card>
    );
}