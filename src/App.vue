<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import notes from '@/components/Notes.vue'
import noteDetails from "@/components/NoteDetails.vue"
import search from "@/components/Search.vue"
import noteDialog from "@/components/NoteDialog.vue"
import topMenu from "@/components/TopMenu.vue"
import CryptoJS from 'crypto-js'
const crypto = inject('cryptojs') as typeof CryptoJS

export type Note = {
  id: number,
  title: string,
  description: string,
  date: string,
}

let webUrl = "https://script.google.com/macros/s/...../exec"
const password = "...Password..."
const salt = "01234567890abcdef01234567890abcd" // crypto.lib.WordArray.random(128 / 8) //.toString()

const generateKey = (): any => {
  const salt_wa = typeof salt === 'string' ? crypto.enc.Hex.parse(salt) : salt
  const key = crypto.PBKDF2(password, salt_wa, {
    keySize: 512 / 32,
    iterations: 1000,
    hasher: crypto.algo.SHA512,
  })
  return key
}
const encrypt = (text: string) => {
  const key = generateKey()
  const iv_wa = crypto.lib.WordArray.random(128 / 8)
  const encrypted = crypto.AES.encrypt(text, key, {
    iv: iv_wa,
  })
  return iv_wa.toString() + "x" + encrypted.toString()
}
const decrypt = (text: string) => {
  const key = generateKey()
  const m = text.match(/^(.*?)x(.*)$/)
  if (!m || m.length <= 1) {
    return ""
  }
  const [iv_str, enc_str] = [m[1], m[2]]
  const decrypted = crypto.AES.decrypt(enc_str, key, {
    iv: crypto.enc.Hex.parse(iv_str),
  })
  return decrypted.toString(crypto.enc.Utf8)
}
//
const dataBaseVer: number = 1
const dataBaseName: string = "NoetsIndexedDB"
const dataBaseStore: string = "NotesStore"
const dataBaseKeyPath: string = "id"
const createIndexedDB = (): void => {
  const indexed: IDBOpenDBRequest = indexedDB.open(dataBaseName, dataBaseVer)

  indexed.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains(dataBaseStore)) {
      db.createObjectStore(dataBaseStore, {
        keyPath: dataBaseKeyPath,
      })
    }
  }
  indexed.onerror = (): void => {
    console.log("Indexed Start Error")
  }
}
const saveNotes = (): void => {
  const indexed: IDBOpenDBRequest = indexedDB.open(dataBaseName)
  indexed.onsuccess = (event: Event): void => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
    const trans: IDBTransaction = db.transaction(dataBaseStore, "readwrite")
    const store: IDBObjectStore = trans.objectStore(dataBaseStore)
    store.clear()
    let id = -1
    for (const n of _notes.value) {
      id += 1
      store.add({
        id: id,
        title: n.title,
        description: encrypt(n.description),
        date: n.date,
      })
    }
    unsaved.value = false
  }
  indexed.onerror = (): void => {
    console.log("Indexed Open Error")
  }
}

const loadNotes = (): void => {
  const indexed: IDBOpenDBRequest = indexedDB.open(dataBaseName)
  indexed.onsuccess = (event: Event): void => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
    const trans: IDBTransaction = db.transaction(dataBaseStore, "readonly")
    const store: IDBObjectStore = trans.objectStore(dataBaseStore)
    store.getAll().onsuccess = (eventGetAll: Event) => {
      unsaved.value = false
      let id = -1
      let notes_tmp: Array<Note> = []
      for (const item of (eventGetAll.target as IDBRequest).result) {
        id += 1
        let d = item.description
        try {
          d = decrypt(d)
        } catch (e) {
        }
        notes_tmp.push(
          {
            id: id,
            title: item.title,
            description: d,
            date: item.date
          }
        )
      }
      _notes.value = notes_tmp
      uniqueId = _notes.value.length - 1
    }
  }
  indexed.onerror = (): void => {
    console.log("Indexed Open Error")
  }
}

createIndexedDB()
loadNotes()

////
let _search = ref<string>('')
let _notes = ref<Array<Note>>([])
const getFilteredNotes = computed((): Array<Note> => {
  let notesToShow = _notes.value
  let notesToSearch = _search.value
  if (!notesToSearch) {
    return sortByDate(notesToShow)
  }
  notesToSearch = notesToSearch.trim().toLowerCase()
  notesToShow = notesToShow.filter(function (item) {
    if (item.title.toLowerCase().indexOf(notesToSearch) !== -1
      || item.description.toLowerCase().indexOf(notesToSearch) !== -1) {
      return item
    }
  })
  return sortByDate(notesToShow)
  function sortByDate(notes: Array<Note>) {
    return notes.sort((firstElement, secondElement) => secondElement.date.localeCompare(firstElement.date))
  }
})
let grid = ref<boolean>(true)
let uniqueId: number = -1
const getUniqueId = () => {
  return uniqueId += 1
}
const removeNote = (id: number) => {
  let allNotes = _notes.value
  for (let index = 0; index < allNotes.length; index++) {
    if (allNotes[index].id === id) {
      allNotes.splice(index, 1)
    }
  }
  delaySaveNote()
  closeNoteDetails()
}
const isMobile = () => {
  let isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  if (isMobileDevice) grid.value = false
  return isMobileDevice
}

//////////
const unsaved = ref(false)
let delaySaveNoteId: number = -1
const delaySaveNote = () => {
  window.clearTimeout(delaySaveNoteId)
  delaySaveNoteId = window.setTimeout(saveNotes, 1000)
}

const curNoteId = ref<number>(-1)
const closeNoteDetails = () => {
  curNoteId.value = -1
}
const nowDateString = () => new Date(Date.now()).toLocaleDateString("ja-JP", {
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
})
const modifyNote = (newNote: Note) => {
  let allNotes = _notes.value
  let bModify = false
  for (let index = 0; index < allNotes.length; index++) {
    if (allNotes[index].id === newNote.id) {
      newNote.date = nowDateString()
      allNotes[index] = newNote
      bModify = true
      unsaved.value = false
      break
    }
  }
  if (!bModify) {
    allNotes.push({
      id: getUniqueId(),
      title: newNote.title,
      description: newNote.description,
      date: nowDateString(),
    })
  }
  unsaved.value = true
  delaySaveNote()
  closeNoteDetails()
}

const showNewNote = () => {
  curNoteId.value = uniqueId + 1
}
const showNote = (id: number) => {
  curNoteId.value = id
}
/////////////////////////////////////////////////////
type CloudStatusType = "None" | "Upload" | "Download"
const cloudStatus = ref<CloudStatusType>("None")
const uploadNotes = () => {
  if (cloudStatus.value !== "None") {
    return
  }
  cloudStatus.value = "Upload"
  const notes_tmp: Array<Note> = []
  let id = -1
  for (const n of _notes.value) {
    id += 1
    notes_tmp.push({
      id: id,
      title: n.title,
      description: encrypt(n.description),
      date: n.date,
    })
  }
  fetch(webUrl, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(notes_tmp)
  })
    .then(response => response.text())
    .then(data => {
      console.log(data)
      cloudStatus.value = "None"
    })
    .catch(error => {
      console.error(error)
      cloudStatus.value = "None"
    })
}
const dowanloadNotes = () => {
  if (cloudStatus.value !== "None") {
    return
  }
  cloudStatus.value = "Download"
  fetch(webUrl)
    .then(response => response.json())
    .then(data => {
      let id = -1
      let notes_tmp: Array<Note> = []
      for (const item of data) {
        id += 1
        let d = item.description
        try {
          d = decrypt(d)
        } catch (e) { }
        notes_tmp.push(
          {
            id: id,
            title: item.title,
            description: d,
            date: item.date
          }
        )
      }
      unsaved.value = true
      _notes.value = notes_tmp
      uniqueId = _notes.value.length - 1
      console.log(data)
      saveNotes()
      cloudStatus.value = "None"
    })
    .catch(error => {
      console.error(error)
      cloudStatus.value = "None"
    })
}
/////////////////////////////////////////////////////
const menuOpend = ref(false)
const menuOpen = () => {
  menuOpend.value = true
}
const menuClose = () => {
  menuOpend.value = false
}
const loadNotesFromJson = (notes_tmp: Array<Note>) => {
  if (cloudStatus.value !== "None") {
    return
  }
  cloudStatus.value = "Download"
  unsaved.value = true
  _notes.value = notes_tmp
  uniqueId = _notes.value.length - 1
  saveNotes()
  cloudStatus.value = "None"
}
</script>

<template>
  <note-dialog :open="curNoteId >= 0">
    <note-details :notes="_notes" :id=curNoteId @remove="removeNote" @save="modifyNote" @close="closeNoteDetails" />
  </note-dialog>
  <note-dialog :open="menuOpend">
    <top-menu :notes="_notes" @close="menuClose" @upload="uploadNotes" @download="dowanloadNotes"
      @load="loadNotesFromJson" />
  </note-dialog>
  <div class="main-content">
    <div class="wrapper">
      <div class="wrapper-content">
        <section>
          <div class="container">
            <h1 class="title">Notes 1.0</h1>
            <div class="note-header">
              <div class="icons">
                <span title="Menu" class="material-symbols-outlined " @click="menuOpen">menu</span>
                <span title="Save" class="grid material-symbols-outlined " :class="{ active: unsaved }"
                  @click="saveNotes">report</span>
                <span title="Add" class="icon material-symbols-outlined" @click="showNewNote">add_notes</span>
              </div>
              <search :value="_search" placeholder="Find a note" @search="_search = $event" />
              <div class="icons" v-if="!isMobile()">
                <span title="Grid" :class="{ active: grid }" class="grid material-symbols-outlined"
                  @click="grid = true">grid</span>
                <span title="List" :class="{ active: !grid }" class="grid material-symbols-outlined"
                  @click="grid = false">list</span>
              </div>
            </div>
            <notes :notes="getFilteredNotes" :grid="grid" @show-note="showNote" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.title {
	margin-bottom: 20px;
	color: #333333;
	font-size: 30px;
	font-weight: 700;
}

.note-header {
  span.icon {
    cursor: pointer;
  }

  span.grid {
    color: grey;
    cursor: pointer;
  }

  span.active {
    color: #494ce8;
  }
}
</style>