import { ESearchEngine } from "~types"

export const onRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const onOpenQueryAtNewTab = (value: string, searchEngine: ESearchEngine) => {
  if (searchEngine === "google") {
    window.open(`https://www.google.com/search?q=${value}`)
  } else if (searchEngine === "baidu") {
    window.open(`https://www.baidu.com/s?wd=${value}`)
  } else {
    // is bing search
    window.open(`https://cn.bing.com/search?q=${value}`)
  }
}