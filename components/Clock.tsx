import { useEffect, useRef, useState } from "react";

import { ENewtabMode } from "~types";
import clsx from "clsx";
import { settingConfigStore } from "~store";
import { useAtom } from "jotai";

export default function Clock() {
  const [setting] = useAtom(settingConfigStore)
  const [clockTime, setClockTime] = useState({hour: '00', min: '00'})
  const timer = useRef<NodeJS.Timer>()
  useEffect(() => {
    const calcClockTime = () => {
      const date = new Date()
      const record = {
        hour: date.getHours().toString().padStart(2, '0'),
        min: date.getMinutes().toString().padStart(2, '0')
      }
      setClockTime(record)
    }
    if(setting.showClock) {
      calcClockTime()
      timer.current = setInterval(calcClockTime, 1000)
    } else {
      clearInterval(timer.current)
    }
  }, [setting.showClock])
  if(!setting.showClock) return null;
  return <div className={clsx("fixed top-2 left-2 p-1 px-2 rounded-sm bg-opacity-10 text-[14px] font-bold", {
    "bg-white text-green-200": setting.mode === ENewtabMode.wallpaper,
    "bg-gray-500 text-gray-800": setting.mode === ENewtabMode.note,
  })}>
    {
     clockTime.hour
    }
    <span className="opacity-50 px-[2px] relative bottom-[1px]">:</span>
    {
      clockTime.min
    }
  </div>
}