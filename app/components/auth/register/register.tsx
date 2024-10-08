"use client";

import { ChevronLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface RegisterProps {
    to_start: () => void;
    on_close: () => void;
    email: string;
}

export default function Register({ to_start, on_close, email }: RegisterProps) {
    const [first_name, set_first_name] = useState("");
    const [last_name, set_last_name] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const { setBanner, setBannerEmail } = useBanner();

    const handle_pre_register = async () => {
        console.log("E-Mail: ", email);
        console.log("Password: ", password);
        try {
            const response = await fetch("http://localhost/api/pre-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, first_name, last_name, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to register");
            }

            setBannerEmail(email);
            setBanner(BannerType.VerifyEmail)

            console.log("E-Mail sent.");
            on_close();
        } catch (error) {
            console.error("Error occured in handle_pre_register: ", error);
        }
    }

    const handle_key_down = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handle_pre_register();
        }
    };

    return (
        <Card className="relative w-screen sm:w-[550px] py-6">
            <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
                <div onClick={to_start} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
                    <ChevronLeft />
                </div>
                <p>Anmeldung abschließen</p>
            </div>
            <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
                <p className="text-lg font-semibold mb-2">Name</p>
                <div className="flex gap-4 mb-4">
                    <label
                        htmlFor="FirstName"
                        className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 flex-1"
                    >
                        <input
                            type="text"
                            id="FirstName"
                            placeholder="First name"
                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                            onChange={(e) => set_first_name(e.target.value)}
                        />
                        <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                            Vorname
                        </span>
                    </label>
                    <label
                        htmlFor="LastName"
                        className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 flex-1"
                    >
                        <input
                            type="text"
                            id="LastName"
                            placeholder="Last name"
                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                            onChange={(e) => set_last_name(e.target.value)}
                        />
                        <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                            Nachname
                        </span>
                    </label>
                </div>


                <p className="text-lg font-semibold mb-2">Password</p>
                <label
                    htmlFor="UserPassword"
                    className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4"
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
                <label
                    htmlFor="UserPasswordVerify"
                    className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8 focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4"
                >
                    <input
                        type="password"
                        id="UserPasswordVerify"
                        placeholder="Password erneut eingeben"
                        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                        onChange={(e) => setPasswordVerify(e.target.value)}
                        onKeyDown={handle_key_down}
                    />
                    <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                        Password erneut eingeben
                    </span>
                </label>

                <p className="text-sm text-gray-600 mb-4">
                    Indem ich Zustimmen und weiter wähle, erkläre ich mich mit den Nutzungsbedingungen von Mano einverstanden und erkenne die Datenschutzbestimmungen an.
                </p>

                <button
                    className="flex items-center justify-center rounded-lg text-white p-4 WeiterButton"
                    onClick={handle_pre_register}
                >
                    Zustimmen und weiter
                </button>
            </div>
        </Card>
    );
}