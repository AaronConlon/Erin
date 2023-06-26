import * as ContextMenu from "@radix-ui/react-context-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon
} from "@radix-ui/react-icons"
import hotkeys from "hotkeys-js"
import React, { type ReactNode, useEffect } from "react"

import { onDownloadCurrentWallpaper } from "~utils/wallpaper"

const SettingContainer = ({ children }: { children: ReactNode }) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [urlsChecked, setUrlsChecked] = React.useState(false)
  const [mode, setMode] = React.useState("wallpaper")

  useEffect(() => {
    const onPrevWallpaper = function (event, handler) {
      return
    }
    const onNextWallpaper = function (event, handler) {
      return
    }
    hotkeys("command+[", onPrevWallpaper)
  }, [])

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item className="ContextMenuItem">
            上一张 <div className="RightSlot">⌘+[</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
            下一张 <div className="RightSlot">⌘+]</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="ContextMenuItem">
            Reload <div className="RightSlot">⌘+R</div>
          </ContextMenu.Item>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            我的书签 <div className="RightSlot">⌘+B</div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            快速搜索
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Label className="ContextMenuLabel">
            页面风格
          </ContextMenu.Label>
          <ContextMenu.RadioGroup value={mode} onValueChange={setMode}>
            <ContextMenu.RadioItem
              className="ContextMenuRadioItem"
              value="wallpaper">
              <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              壁纸Fans
            </ContextMenu.RadioItem>
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
              disabled={mode !== "wallpaper"}>
              壁纸控制
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
                <ContextMenu.Item className="ContextMenuItem">
                  随机切换
                </ContextMenu.Item>
                <ContextMenu.Item className="ContextMenuItem">
                  选择壁纸
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export default SettingContainer
