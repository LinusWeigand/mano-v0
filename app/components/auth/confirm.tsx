// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { X } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"

// interface AccountConfirmationProps {
//     onClose: () => void;
//     onResendCode: () => void;
// }

// export default function AccountConfirmation({ onClose, onResendCode }: AccountConfirmationProps) {
//     const [code, setCode] = useState(['', '', '', '', '', ''])
//     const inputs = useRef<(HTMLInputElement | null)[]>([])

//     const handleChange = (index: number, value: string) => {
//         if (value.length <= 1 && /^[0-9]*$/.test(value)) {
//             const newCode = [...code]
//             newCode[index] = value
//             setCode(newCode)

//             // Move to next input if value is entered
//             if (value && index < 5) {
//                 inputs.current[index + 1]?.focus()
//             }
//         }
//     }

//     const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Backspace' && !code[index] && index > 0) {
//             inputs.current[index - 1]?.focus()
//         }
//     }

//     useEffect(() => {
//         inputs.current[0]?.focus()
//     }, [])

//     return (
//         <Card className="relative w-screen sm:w-[550px] py-6">
//             <div className="flex justify-center font-bold pb-[15px] border-b border-[#ddd] w-full">
//                 <div className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
//                     <X onClick={onClose} />
//                 </div>
//                 <p>Confirm account</p>
//             </div>
//             <div className="flex flex-col items-stretch mt-[25px] mx-6 mb-[15px]">
//                 <p className="text-[25px] font-medium mb-2">Enter your verification code</p>
//                 <p className="text-gray-600 mb-5">Enter the code we emailed to your email.</p>

//                 <div className="flex justify-start mb-4">
//                     {code.map((digit, index) => (
//                         <Input
//                             key={index}
//                             type="text"
//                             inputMode="numeric"
//                             maxLength={1}
//                             value={digit}
//                             onChange={(e) => handleChange(index, e.target.value)}
//                             onKeyDown={(e) => handleKeyDown(index, e)}
//                             ref={(el) => inputs.current[index] = el}
//                             className="w-12 h-12 text-center text-2xl border-gray-400 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
//                         />
//                     ))}
//                 </div>

//                 <button
//                     onClick={onResendCode}
//                     className="text-left text-sm text-gray-600 hover:underline"
//                 >
//                     Didn't get an email? Try again
//                 </button>
//             </div>
//         </Card>
//     )
// }