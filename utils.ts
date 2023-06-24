import crypto from "crypto-js"

const TRANSLATE_API_ADDR =
  "https://fanyi-api.baidu.com/api/trans/vip/translate?"

export const translateTo = async (
  query: string,
  key: string,
  appid: string,
  isEnToZh: boolean
) => {
  const paramsObject = {
    from: isEnToZh ? "en" : "zh",
    q: query,
    to: isEnToZh ? "zh" : "en",
    appid,
    salt: "1234"
  }
  // generate sign value
  const sign = crypto.MD5(
    `${paramsObject.appid}${query}${paramsObject.salt}${key}`
  )
  paramsObject["sign"] = sign.toString()
  // cover object to url params
  const urlParams = Object.entries(paramsObject)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  const res = await fetch(`${TRANSLATE_API_ADDR}${urlParams}`, {
    method: "GET"
  })
  const responseRecord = await res.json()
  return responseRecord as {
    from: string
    to: string
    trans_result: {
      src: string
      dst: string
    }[]
  }
}
