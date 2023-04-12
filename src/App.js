import Note from './components/Note'
import notesServices from './services/notes'
import './index.css'
import { useEffect, useState } from 'react'

const App = () => {
  
  const [notes , setNotes] = useState([])
  const [NewNote, setNewNote] = useState('new note or something')
  const [showAll, setShowAll] = useState(true)

  useEffect(()=>{
    console.log('Effect')
    notesServices
      .getAll()
      .then(
        initialValues => setNotes(initialValues)
      )
    console.log('render' , notes.length, 'notes')
  },[])

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      important : Math.random() < 0.5,
      content : NewNote
    }
    
    notesServices 
      .create(noteObject)
      .then(
        response => {
          setNotes(notes.concat(response))
          setNewNote('')
        }
      )
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter( note => note.important === true ) 

  const toggleImportance = (id) => () =>{
    const note = notes.find(n => id === n.id )
    const NewNoteObject = {...note , important: !note.important}

    notesServices
      .update( id , NewNoteObject)
      .then(  response => setNotes(notes.map(note => id !== note.id ? note : response )) )
      .catch( error => {
        alert( `the note ${note.content} is already deleted`)
        setNotes( notes.filter(n => n.id !== id ) )
      })
    }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map( note =>
          <Note   note={note} key={note.id} toggleImportance={toggleImportance(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={NewNote} 
        onChange={handleNoteChange}></input>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App
