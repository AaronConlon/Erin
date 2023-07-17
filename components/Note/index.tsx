import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import { settingConfigStore } from "~store"
import { ENewtabMode, EStorageKey, INote } from "~types"
import { generateId } from "~utils/browser"
import {
  getNoteListFromStorage,
  removeNoteById,
  saveNote
} from "~utils/storage"

import NoteItem from "./NoteItem"

export default function () {
  const [noteList, setNoteList] = useState([] as INote[])
  const [setting] = useAtom(settingConfigStore)
  useEffect(() => {
    // get note list from storage
    const init = async () => {
      const noteItems = await getNoteListFromStorage()
      if (noteItems.length > 0) {
        setNoteList(noteItems)
      } else {
        const _noteList = [
          {
            id: generateId(),
            title: "bala bala...",
            content: "...",
            color: "#333",
            bgColor: "#fff"
          }
        ]
        setNoteList(_noteList)
        saveNote(_noteList[0])
      }
    }
    init()
    // handler storage change
    const onChangeNoteListInStorage = (changes, namespace) => {
      // console.log(changes, namespace)
      if (namespace === "local" && changes[EStorageKey.noteList]) {
        init()
      }
    }
    if (setting.mode === ENewtabMode.note) {
      chrome.storage.onChanged.addListener(onChangeNoteListInStorage)
    }
    return () => {
      if (setting.mode === ENewtabMode.note) {
        chrome.storage.onChanged.removeListener(onChangeNoteListInStorage)
      }
    }
  }, [])

  const onRemoveNoteById = (id: string) => {
    const _newNoteList = noteList.filter((i) => i.id !== id)
    console.log(_newNoteList)
    setNoteList(_newNoteList)
    removeNoteById(id)
  }

  return (
    <div className="note-list-container">
      <div className="note-items">
        {noteList.map((i) => (
          <NoteItem data={i} key={i.id} onRemove={onRemoveNoteById} />
        ))}
      </div>
    </div>
  )
}
