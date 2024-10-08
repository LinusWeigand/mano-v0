
"use client";

import { AlertCircle, ChevronLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginProps {
    back_to_login: () => void;
    on_close: () => void;
    show_email_sent_banner: (email: string) => void;
}

export default function ForgotPassword({ back_to_login, on_close, show_email_sent_banner }: LoginProps) {
    const [email, setEmail] = useState("");
    const [show_email_not_found_alert, set_show_email_not_found_alert] = useState(true);

    const handle_send_reset_link = async () => {
        console.log("forgot_password email: ", email);
        try {
            const response = await fetch("http://localhost/api/pre-reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                set_show_email_not_found_alert(true);
                return;
            }
            on_close();
            show_email_sent_banner(email);
        } catch (error) {
            console.error("Error occured in handle_send_reset_link: ", error);
        }
    };

    return (
        <Card className="relative w-screen sm:w-[550px] py-6">
            <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
                <div onClick={back_to_login} className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
                    <ChevronLeft />
                </div>
                <p>Password vergessen?</p>
            </div>
            <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
                <p className="mb-4">Gib die E-Mail Addresse ein, welche mit deinem Konto verbunden ist und wir schicken dir eine E-Mail um dein Passwort zurückzusetzen. </p>
                {show_email_not_found_alert && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
                        <div className="bg-red-500 rounded-full p-2 mr-3 flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Let's try that again</h4>
                            <p className="text-gray-600">No account exists for the requested email address</p>
                        </div>
                    </div>
                )}

                <label
                    htmlFor="UserEmail"
                    className="relative block overflow-hidden rounded-lg border border-gray-400 px-3 pt-8  focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 peer-placeholder-shown:border-black"
                >
                    <input
                        type="email"
                        id="UserEmail"
                        placeholder="E-Mail"
                        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-lg"
                        onChange={(e) => setEmail(e.target.value)}

                    />

                    <span className="absolute start-3 top-5 -translate-y-1/2 text-md text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-5 peer-placeholder-shown:text-black text-gray-600">
                        E-Mail
                    </span>
                </label>

                <button
                    className="flex items-center justify-center rounded-lg text-white p-4 mt-4 bg-darkButton-light hover:bg-darkButton-dark"
                    onClick={handle_send_reset_link}
                >
                    Zurücksetzungslink schicken
                </button>
            </div>
        </Card>
    );
}