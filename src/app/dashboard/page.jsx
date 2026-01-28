import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout, addNote, deleteNote } from './actions'
export const dynamic = "force-dynamic";


export default async function Dashboard() {
  const supabase = await createClient()

  // get user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // ✅ ADMIN CHECK (your email)
  const isAdmin = user.user_metadata?.is_admin === true

  // get notes
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Welcome! 👋
            </h1>
            <p style={{ color: '#666' }}>{user.email}</p>
          </div>

          <form action={logout}>
            <button type="submit" style={{
              padding: '12px 24px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </form>
        </div>

        {/* Add note */}
        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2>Add a Note 📝</h2>
          <form action={addNote} style={{ display: 'flex', gap: '10px' }}>
            <input
              name="title"
              required
              placeholder="Enter note title..."
              style={{ flex: 1, padding: '10px' }}
            />
            <button type="submit">Add Note</button>
          </form>
        </div>

        {/* Notes */}
        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px' }}>
          <h2>Your Notes</h2>

          {(!notes || notes.length === 0) ? (
            <p>No notes yet</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {notes.map(note => (
                <div key={note.id} style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '10px'
                }}>
                  <strong>{note.title}</strong>
                  <div style={{ fontSize: '12px', color: '#777' }}>
                    {new Date(note.created_at).toLocaleString()}
                  </div>

                  {/* ✅ DELETE BUTTON (ADMIN ONLY) */}
                  {isAdmin && (
                    <form action={deleteNote}>
                      <input type="hidden" name="id" value={note.id} />
                      <button
                        type="submit"
                        style={{
                          marginTop: '10px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
