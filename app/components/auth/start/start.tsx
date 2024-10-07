
"use client";
import { X } from "lucide-react";
import "./start.css";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";

interface StartProps {
    on_close: () => void;
    to_login: (email: string) => void;
    to_register: (email: string) => void;
}

const Start = ({ on_close, to_login, to_register }: StartProps) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handle_next = async () => {
        setLoading(true);
        console.log("handle_next email:", email);
        try {
            const response = await fetch(`http://localhost/api/viewers/${email}`, {
                method: "GET",
            });

            if (!response.ok) {
                console.log("Viewer not found.");
                to_register(email);
                return;
            }
            console.log("Viewer found.");
            to_login(email)
        } catch (error) {
            console.error("Error occured in handle_next: ", error);
        }
    }

    return (
        <Card className="relative w-screen sm:w-[550px] py-6">
            <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
                <div className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
                    <X onClick={on_close} />
                </div>
                <p>Einloggen oder registrieren</p>
            </div>
            <div className="flex flex-col items-strech mt-[25px] mx-6 mb-[15px]">
                <p className="text-[25px] font-medium mb-5">Willkommen bei Mano</p>

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
                {loading ?
                    (<button
                        className="flex flex items-center justify-center gap-[6px] rounded-lg text-white p-4 mt-4 bg-gray-300 h-[56px]"
                        onClick={handle_next}
                    >
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] -m-"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>

                    </button>)

                    : (<button
                        className="flex items-center justify-center rounded-lg text-white p-4 mt-4 WeiterButton"
                        onClick={handle_next}
                    >
                        Weiter
                    </button>)
                }

                <div className="LoginLineBreak">
                    <div className="Line" />
                    <p> oder </p>

                    <div className="Line" />
                </div>

                <button className="LoginButton">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="48px"
                        height="48px"
                        className="GoogleIcon"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                    </svg>
                    Weiter mit Google
                </button>
            </div>
        </Card>
    );
};

export default Start;
