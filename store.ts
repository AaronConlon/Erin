import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { ESettingMode, type ISettingConfig } from "~types"

const localInstance = new Storage({area: "local"})

export const useSettingStore = () => {
  const [settingConfig, setSettingConfig] = useStorage({
    key: "settings",
    instance: localInstance
  }, {
    mode: ESettingMode.image
  } as ISettingConfig)
  return { settingConfig,setSettingConfig }
}