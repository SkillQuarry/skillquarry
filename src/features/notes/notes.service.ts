export const notesService = {
  async listNotes() {
    return Promise.resolve([])
  },
  async saveNote() {
    return Promise.resolve({ saved: true })
  },
}
