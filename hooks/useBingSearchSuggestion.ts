import { useRef, useState } from "react"

import { getSearchSuggestions } from "~utils/request"

export default function () {
  const [suggestions, setSuggestions] = useState<string[]>(
    ['12306火车票官网', '123', '12306官网', '123云盘', '1234', '123网址之家', '123movies', '123rf']
  )
  const timer = useRef<NodeJS.Timer>(null)
  const query = async (keyword: string) => {
    clearTimeout(timer.current)
    if (keyword === '') {
      setSuggestions([])
      return
    }
    timer.current = setTimeout(async () => {
      const res = await getSearchSuggestions(keyword)
      setSuggestions(res)
    }, 350)
  }
  return { suggestions, query }
}