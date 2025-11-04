import Note from '../models/Note.js';

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes', error });
  }
}

export async function createNote(req, res) {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
}

export async function updateNote(req, res) {
  try {
    const {title,content} = req.body
    await Note.findByIdAndUpdate(req.params.id,{ title, content }); 
    res.status(200).json({message: 'Note updated successfully!' });
  } catch (error) {
    console.error("error in updating", error);
    res.status(500).json({ message: 'Error updating note', error });
  }
}

export async function deleteNote(req, res) {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
}
