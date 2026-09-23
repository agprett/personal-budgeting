import { useEffect, useRef, useState } from "react";

function EdittingField ({value, type = 'text', options, onSave, className, inputClassName}) {
  const inputRef = useRef(null)
  const [edit, setEdit] = useState(false)
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    if(edit && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 0)
    }
  }, [edit])

  const commit = () => {
    onSave(draft)
    setEdit(false)
  }

  const edittable = () => {
    const base = `bg-[#050d1a] border border-[#1d6dce] rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#38bdf8]/40 ${inputClassName}`

    if(type === 'select') {
      return (
        <select
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          className={base + ' cursor-pointer'}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      )
    } else {
      return (
        <input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(evt) => {
            if(evt.key ==='Enter'){
              setEdit(false)
              commit(evt.target.value)
            }
          }}
          className={base + ' min-w-[60px]'}
          // style={{ width: `${Math.max(draft.length + 4, 6)}ch` }}
        />
      )
    }
  } 
  
  return (
    edit ? (
      edittable()
    ) : (
      <span
        onClick={() => setEdit(true)}
        className={`cursor-text hover:underline decoration-dashed decoration-[#1d6dce] underline-offset-2 transition-all ${className}`}
      >
        {type === 'number' ? value.toLocaleString() : value}
      </span>
    )
  );
}

export default EdittingField