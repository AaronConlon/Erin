import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function () {
  return (
    <div className="z-40 flex max-w-max items-center justify-center p-1 bg-[#22222230] fixed top-2 right-2 text-[24px] rounded-full text-white ">
      <AiOutlineLoading3Quarters className="animate-spin" />
      <span className="bg-gray-300 absolute top-[25%] right-[25%] w-4 h-4 rounded-full"></span>
    </div>
  )
}
