import { EBgMessageName, EContentMenuImgAction, EMenuItemId, EReadItLaterLevel, EStorageKey } from "~types";

import { addReadItLaterList } from "~utils/storage";
import { sendToContentScript } from "@plasmohq/messaging";

// define all context menu feature
export default async function initContextMenu() {
  chrome.contextMenus.create({
    title: "Erin工具包",
    id: "tools"
  })
  chrome.contextMenus.create({
    title: "🔖 添加到待阅读列表",
    parentId: "tools",
    id: EMenuItemId.addCurrentPageToReadItLater   
  })
  chrome.contextMenus.create({
    title: "📖 复制当前页为markdown链接",
    parentId: "tools",
    id: EMenuItemId.copyAsMdLink,
    contexts: ['page']
  });
  chrome.contextMenus.create({
    title: "📖 复制当前链接为markdown链接",
    id: `${EMenuItemId.copyAsMdLink}-link`,
    contexts: ['link']
  });
  const levels = [EReadItLaterLevel.important, EReadItLaterLevel.urgent, EReadItLaterLevel.later];
  levels.forEach((item) => {
    chrome.contextMenus.create({
      title: item,
      parentId: EMenuItemId.addCurrentPageToReadItLater,
      id: item
    })
  })

  // for image
  chrome.contextMenus.create({
    id: EMenuItemId.img,
    title: 'Erin - 图片工具',
    contexts: ['image']
  });

  // video picture in picture
  chrome.contextMenus.create({
    title: '📺 为播放中的视频开启画中画模式',
    contexts: ['page'],
    id: EMenuItemId.pictureInPicture,
    parentId: 'tools'
  })

  const imgActions = [EContentMenuImgAction.copyImgAsMarkdown, EContentMenuImgAction.downloadCurrentImg, EContentMenuImgAction.downloadFormat];
  imgActions.forEach((action) => {
    chrome.contextMenus.create({
      parentId: EMenuItemId.img,
      id: action,
      title: action,
      contexts: ['image']
    })
  })

  const formatImgItems = [EContentMenuImgAction.downloadAsJPEG, EContentMenuImgAction.downloadAsJPG, EContentMenuImgAction.downloadAsPNG];
  formatImgItems.forEach((item) => {
    chrome.contextMenus.create({
      parentId: EContentMenuImgAction.downloadFormat,
      id: item,
      title: item,
      contexts: ['image']
    })
  })

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    try {
      const currentTab = await chrome.tabs.get(tab.id)
      const {menuItemId, srcUrl} = info
      if(levels.includes(menuItemId as EReadItLaterLevel)) {
        // get current tab
      const {id, title, url, favIconUrl} = currentTab
        // add current page to read it later
        addReadItLaterList({id: `${id}`, title, url, favIconUrl, level: menuItemId as EReadItLaterLevel})
      } else if(menuItemId.toString().startsWith(EMenuItemId.copyAsMdLink)) {
        const isCopyPage = menuItemId.toString() === EMenuItemId.copyAsMdLink
        const mdUrl = `[${isCopyPage ? tab.title: info.selectionText}](${isCopyPage ? tab.url: info.linkUrl})`
        sendToContentScript({
          name: EBgMessageName.copyMdContentToClipboard,
          body: {
            text: mdUrl
          }
        })
      } else if(imgActions.includes(menuItemId.toString() as any) ) {
        if(menuItemId === EContentMenuImgAction.copyImgAsMarkdown) {
          const mdUrl = `![](${srcUrl})`
          sendToContentScript({
            name: EBgMessageName.copyMdContentToClipboard,
            body: {
              text: mdUrl
            }
          })
        } else if(menuItemId === EContentMenuImgAction.downloadCurrentImg) {
          chrome.downloads.download({url: srcUrl})
        } 
      } else if(formatImgItems.includes(menuItemId.toString() as any)) {
        // cover format to target format
        // chrome.downloads.download({url: srcUrl, filename: `${generateId()}.${menuItemId.toString().toLocaleLowerCase()}`})
        sendToContentScript({
          name: EBgMessageName.downloadImgWithFormat,
          body: {
            url: srcUrl,
            format: menuItemId.toString().toLocaleLowerCase()
          }
        })
      } else if(menuItemId === EContentMenuImgAction.copyLinkAsMarkdown) {
        const mdUrl = `[${info.linkUrl}](${info.linkUrl})`
        sendToContentScript({
          name: EBgMessageName.copyMdContentToClipboard,
          body: {
            text: mdUrl
          }
        })
      } else if(menuItemId === EMenuItemId.pictureInPicture) {
        sendToContentScript({
          name: EBgMessageName.applyPicInPicMode,
        })
      }
    } catch (error) {
      console.log('copy current page as markdown link failed', error)
    }
  })
}