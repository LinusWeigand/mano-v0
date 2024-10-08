"use client";

import { AlertCircle, ChevronLeft, X } from "lucide-react";
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
    const [show_password_incorrect_alert, set_show_password_incorrect_alert] = useState(false);

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
                set_show_password_incorrect_alert(true);
                return;
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
                <p>Anmelden</p>
            </div>
            <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">

                {show_password_incorrect_alert && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
                        <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
                            <AlertCircle className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Lass uns das nochmal versuchen</h4>
                            <p className="text-gray-600">Passwort ist inkorrekt.</p>
                        </div>
                    </div>
                )}
                <label
                    htmlFor="UserPassword"
                    className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
                >
                    <input
                        type="password"
                        id="UserPassword"
                        placeholder="Passwort"
                        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                        onChange={(e) => setPassword(e.target.value)}

                    />

                    <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                        Passwort
                    </span>
                </label>

                <button
                    className="flex items-center justify-center rounded-lg text-white p-4 mt-4 WeiterButton"
                    onClick={handleLogin}
                >
                    Anmelden
                </button>

                <p className="text-md text-left underline mt-4 text-black hover:underline cursor-pointer" onClick={to_forgot_password}>
                    Passwort vergessen?
                </p>
            </div>
        </Card>
    );
}