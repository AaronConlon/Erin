import * as ContextMenu from "@radix-ui/react-context-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon
} from "@radix-ui/react-icons"
import hotkeys from "hotkeys-js"
import { useAtom } from "jotai"
import React, { type ReactNode, useEffect } from "react"

import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"
import { DEFAULT_BING_WALLPAPER_DOMAIN } from "~types"
import {
  getWallpaperBase64FromUrl,
  onDownloadCurrentWallpaper,
  onGetCurrentWallpaper,
  onGetPrevOrNextWallpaper
} from "~utils/wallpaper"

const SettingContainer = ({ children }: { children: ReactNode }) => {
  const [settingConfig, setSettingConfig] = useAtom(settingConfigStore)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)
  const [systemShortcut, setSystemShortcut] = React.useState({ fullscreen: "" })
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [isLoading, setIsLoading] = useAtom(isLoadingWallpaperStore)

  const commandLogic = async (isPrev = true) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      const { url } = await onGetCurrentWallpaper()
      const { urlbase } = await onGetPrevOrNextWallpaper(url, isPrev)
      const base64 = await getWallpaperBase64FromUrl(
        `${DEFAULT_BING_WALLPAPER_DOMAIN}${urlbase}_UHD.jpg`
      )
      setCurrentWallpaperBase64(base64)
    } catch (error) {
      console.log("get prev or next wallpaper failed. isPrev:", isPrev)
    } finally {
      setIsLoading(false)
    }
  }

  const onPrevWallpaper = function (event) {
    event.preventDefault()
    commandLogic(true)
  }
  const onNextWallpaper = function (event) {
    event.preventDefault()
    commandLogic(false)
  }

  const onOpenWallpaperMarket = function (event) {
    setSettingConfig((_config) => ({
      ..._config,
      showBrowserTreeNav: false,
      showSearchBar: false,
      showWallpaperMarket: !_config.showWallpaperMarket
    }))
    event.preventDefault()
  }

  const onSwitchIsShowBookmark = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showBrowserTreeNav: false,
      showSearchBar: false,
      showBookmark: !_config.showBookmark
    }))
  }

  const onSwitchIsShowSearchBar = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showBrowserTreeNav: false,
      showBookmarkBar: false,
      showSearchBar: !_config.showSearchBar
    }))
  }

  const onSwitchIsShowTreeNav = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showSearchBar: false,
      showBookmarkBar: false,
      showBrowserTreeNav: !_config.showBrowserTreeNav
    }))
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  useEffect(() => {
    // get system shortcut
    // get system os
    const os = navigator.platform
    if (os.includes("Mac")) {
      setSystemShortcut({
        fullscreen: "Ctrl+⌘+F"
      })
    } else {
      setSystemShortcut({
        fullscreen: "F11"
      })
    }

    hotkeys("command+[", onPrevWallpaper)
    hotkeys("command+]", onNextWallpaper)
    hotkeys("command+.", onOpenWallpaperMarket)
    hotkeys("command+B", onSwitchIsShowBookmark)
    hotkeys("command+K", onSwitchIsShowSearchBar)
    hotkeys("Ctrl+command+N", onSwitchIsShowTreeNav)

    return () => {
      hotkeys.unbind("command+[")
      hotkeys.unbind("command+]")
      hotkeys.unbind("command+.")
      hotkeys.unbind("command+B")
      hotkeys.unbind("command+K")
      hotkeys.unbind("Ctrl+command+N")
    }
  }, [])

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item
            className="ContextMenuItem"
            onClick={toggleFullScreen}>
            {isFullScreen ? "取消" : ""}全屏{" "}
            <div className="RightSlot">{systemShortcut.fullscreen}</div>
          </ContextMenu.Item>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Label className="ContextMenuLabel">
            🔨 Tools
          </ContextMenu.Label>
          {/* 树形浏览器资源工具 */}
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={settingConfig.showBrowserTreeNav}
            onCheckedChange={(v) => {
              setSettingConfig({ ...settingConfig, showBrowserTreeNav: v })
            }}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            树形导航 <div className="RightSlot">Ctrl+⌘+N</div>
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Label className="ContextMenuLabel">
            页面风格
          </ContextMenu.Label>
          <ContextMenu.RadioGroup
            value={settingConfig.mode}
            onValueChange={(value) =>
              setSettingConfig({ ...settingConfig, mode: value })
            }>
            <ContextMenu.RadioItem
              className="ContextMenuRadioItem"
              value="wallpaper">
              <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              壁纸Fans
            </ContextMenu.RadioItem>
            {/* TODO:便签开发 */}
            <ContextMenu.RadioItem
              className="ContextMenuRadioItem"
              value="notes">
              <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              便签 👨‍💻‍
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              className="ContextMenuSubTrigger"
              disabled={settingConfig.mode !== "wallpaper"}>
              壁纸Fans - 设置
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className="ContextMenuSubContent"
                sideOffset={2}
                alignOffset={-5}>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onPrevWallpaper as any}>
                  上一张 <div className="RightSlot">⌘+[</div>
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onPrevWallpaper as any}>
                  下一张 <div className="RightSlot">⌘+]</div>
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onDownloadCurrentWallpaper}>
                  下载当前壁纸… <div className="RightSlot">↓</div>
                </ContextMenu.Item>

                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onOpenWallpaperMarket as any}>
                  所有壁纸 <div className="RightSlot">⌘+.</div>
                </ContextMenu.Item>
                <ContextMenu.Separator className="ContextMenuSeparator" />
                <ContextMenu.Label className="ContextMenuLabel">
                  页面组件
                </ContextMenu.Label>
                <ContextMenu.CheckboxItem
                  className="ContextMenuCheckboxItem"
                  checked={settingConfig.showBookmark}
                  onCheckedChange={(v) => {
                    setSettingConfig({ ...settingConfig, showBookmark: v })
                  }}>
                  <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                    <CheckIcon />
                  </ContextMenu.ItemIndicator>
                  书签 <div className="RightSlot">⌘+B</div>
                </ContextMenu.CheckboxItem>
                <ContextMenu.CheckboxItem
                  className="ContextMenuCheckboxItem"
                  checked={settingConfig.showSearchBar}
                  onCheckedChange={(value) => {
                    setSettingConfig((v) => ({ ...v, showSearchBar: value }))
                  }}>
                  <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                    <CheckIcon />
                  </ContextMenu.ItemIndicator>
                  搜索框 <div className="RightSlot">⌘+K</div>
                </ContextMenu.CheckboxItem>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              className="ContextMenuSubTrigger"
              disabled={settingConfig.mode !== "notes"}>
              便签页 - 设置
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className="ContextMenuSubContent"
                sideOffset={2}
                alignOffset={-5}>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onDownloadCurrentWallpaper}>
                  下载当前壁纸… <div className="RightSlot">↓</div>
                </ContextMenu.Item>
                {/* <ContextMenu.Item className="ContextMenuItem">
                  随机切换
                </ContextMenu.Item> */}
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onOpenWallpaperMarket as any}>
                  选择壁纸 <div className="RightSlot">⌘+.</div>
                </ContextMenu.Item>

                <ContextMenu.CheckboxItem
                  className="ContextMenuCheckboxItem"
                  checked={settingConfig.showBookmark}
                  onCheckedChange={(v) => {
                    setSettingConfig({ ...settingConfig, showBookmark: v })
                  }}>
                  <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                    <CheckIcon />
                  </ContextMenu.ItemIndicator>
                  我的书签 <div className="RightSlot">⌘+B</div>
                </ContextMenu.CheckboxItem>
                <ContextMenu.CheckboxItem
                  className="ContextMenuCheckboxItem"
                  checked={settingConfig.showSearchBar}
                  onCheckedChange={(value) => {
                    setSettingConfig((v) => ({ ...v, showSearchBar: value }))
                  }}>
                  <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                    <CheckIcon />
                  </ContextMenu.ItemIndicator>
                  快速搜索
                </ContextMenu.CheckboxItem>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export default SettingContainer
