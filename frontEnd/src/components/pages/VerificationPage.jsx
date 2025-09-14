import React, { useEffect, useState } from 'react'
import useAuthStore from '../../store/useAuthStore.js'
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';

const VerificationPage = () => {
const {authUser, sendOtp, isSendingOtp, isVerifyingOtp, verifyOtp} = useAuthStore();
const [cooldownTime, setCooldownTime] = useState(new Date(1));
const [timeLeft, setTimeLeft] = useState([0,0,0]);
const [code, setCode] = useState(["","","","","",""]);
const inputRefs = useRef([]);
useEffect(()=>{
  inputRefs.current = inputRefs.current.slice(0, 6);
},[]);
useEffect(()=>{
  if(!authUser) return;
  let timer;
  const updateTime = ()=>{
    if(new Date() - new Date(authUser.otp.nextResendAttempt)>0){
      clearInterval(timer)
    };
    const diff = new Date(new Date(authUser.otp.nextResendAttempt) - new Date()).getTime();
    setCooldownTime(new Date(new Date(diff)));
    const hrsCnt = Math.floor(diff/(1000*60*60))%24;
    const minCnt = Math.floor(diff/(1000*60))%60;
    const secCount = Math.floor(diff/(1000))%60;
    setTimeLeft([secCount, minCnt, hrsCnt]);
  };
  updateTime();
  timer = setInterval(updateTime, 1000);
  return () => clearInterval(timer);
},[authUser]);
const handleSubmit = async (e) => {
  e.preventDefault();
  const otp = code.join("");
  try {
    await verifyOtp({otp: otp});
  } catch (error) {
    
  }
};

const handleChange = (index, value)=>{
  const newCode = [...code];
  if(value.length>2){
    const pastedCode = value.slice(0, 6).split("");
    for(let i = 0; i<6; i++) newCode[i] = pastedCode[i]||"";
    setCode(newCode);
    const lastFilledIndex = newCode.findLastIndex((digit) => digit!=="");
    const focusIndex = lastFilledIndex<5?lastFilledIndex+1:5;
    inputRefs.current[focusIndex].focus();
  }else if(value.length!=2){
    newCode[index] = value;
    setCode(newCode);
    if(value&&index<5){
      inputRefs.current[index + 1].focus();
    }
  }else{
    const pastedCode = value.slice(0, 2).split("");
    if(code[index]===pastedCode[0]){
      code[index] = pastedCode[1];
      if(index<5) inputRefs.current[index+1].focus();
    }
  }
  
};
const handleKeyDown = (index, e)=>{
  if(e.key === "Backspace" && !code[index] && index>0){
    inputRefs.current[index-1].focus();
  }
};
  return (
    <div className='h-screen overflow-auto scrollbar-hide flex justify-center items-center'>
        <div className='w-fit p-6 sm:p-10 rounded-box border border-base-200 bg-base-300 '>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-6 '>
                <div className='w-full h-full flex justify-between items-center'>
                  <label className='text-sm font-semibold'>Enter OTP</label>
                  <button className={`btn w-24 h-fit self-end scale-[80%] ${cooldownTime.getTime()>300?`text-lg`:`text-md`} btn-outline`} type='button' onClick={sendOtp} disabled={isVerifyingOtp||cooldownTime.getTime()>300}>
                      {

                        (cooldownTime.getTime()<300?`Send OTP`:((timeLeft[2]?("0"+timeLeft[2].toString()+":"):'')+(timeLeft[1]>9?"":"0")+timeLeft[1]+":"+(timeLeft[0]>9?"":"0")+timeLeft[0]))

                      }
                    </button>
                </div>
                <div className='flex justify-center items-center gap-1 sm:gap-2 scale-[100%] sm:scale-100'>
                      {
                        code.map((digit, index) => (
                          <input key={index} ref={(_) => (inputRefs.current[index] = _)} inputMode='numeric' onChange={(e)=>handleChange(index, e.target.value)} onKeyDown={(e)=>handleKeyDown(index, e)} maxLength='6'className='w-10 p-0 sm:w-full input-bordered input aspect-square focus:outline-none focus:border-primary font-semibold  text-lg text-center' value={code[index]}/>
                        ))
                      }
                </div>
                <button className='btn-primary btn mt-5' type='submit'disabled={isVerifyingOtp||isSendingOtp}>
                  {(isVerifyingOtp||isSendingOtp)?
                  <Loader2 className='animate-spin'/>:
                  "Submit"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default VerificationPage;