export type NoteWithoutId = {
  title: string,
  content: string,
  private: boolean,
  pinned: boolean,
  dateCreated: Date,
  dateUpdated: Date,
  color: string,
  tags: string[],
  views: number
}

export type Note = NoteWithoutId & { _id: string }
export type NoteId = Note['_id']

// lub
// export type Note = {
//   _id: string,
//   title: string,
//   content: string,
//   private: boolean,
//   pinned: boolean,
//   dateCreated: Date,
//   dateUpdated?: Date,
//   color: string,
//   tags: string[]
// }

// export type NewNote = Omit<Note, '_id' | 'dateUpdated'>

