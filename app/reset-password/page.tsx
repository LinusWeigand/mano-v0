"use client";

import { ChevronLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface ResetPasswordProps {
    on_close: () => void;
}

export default function ResetPassword({ on_close }: ResetPasswordProps) {
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const router = useRouter();
    const { setBanner } = useBanner();

    const searchParams = useSearchParams();
    const reset_password_token = decodeURIComponent(searchParams.get('c') || '');
    const email = decodeURIComponent(searchParams.get('e') || '');

    const handle_reset_password = async () => {
        console.log("E-Mail: ", email);
        console.log("Password: ", password);
        console.log("Code: ", reset_password_token);
        try {
            const response = await fetch("http://localhost/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, reset_password_token }),
            });

            if (!response.ok) {
                setBanner(BannerType.ResetPasswordExpired);
                router.push('/forgot-password');
                return;
            }

            setBanner(BannerType.PasswordResetted);
            router.push('/');
            console.log("Passwort resetted.")
        } catch (error) {
            console.error("Error occured in handleLogin: ", error);
        }
    };

    return (
        <div className="flex flex-col  min-h-screen relative">
            <div className="flex justify-center h-full items-center m-w-screen border-t border-[#ddd] flex-grow">
                <Card className="relative w-screen sm:w-[550px] py-6 border-gray-400">
                    <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
                        <div onClick={on_close} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
                            <ChevronLeft />
                        </div>
                        <p>Passwort aktualisieren</p>
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
                        <label
                            htmlFor="UserPasswordVerify"
                            className="relative block mt-4 overflow-hidden rounded-lg border border-gray-400 px-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
                        >
                            <input
                                type="password"
                                id="UserPasswordVerify"
                                placeholder="Password"
                                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                                onChange={(e) => setPasswordVerify(e.target.value)}

                            />

                            <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                                Password erneut eingeben
                            </span>
                        </label>

                        <button
                            className="flex items-center justify-center rounded-lg text-white p-4 mt-4 bg-darkButton-light hover:bg-darkButton-dark"
                            onClick={handle_reset_password}
                        >
                            Aktualisieren
                        </button>
                    </div>
                </Card>
            </div>
        </div >
    );
}