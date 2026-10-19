type ModuleHeaderProps = {
  eyebrow: string
  title: string
  note?: string
  titleId?: string
}

export function ModuleHeader({ eyebrow, title, note, titleId }: ModuleHeaderProps) {
  return (
    <header className="module-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={titleId}>{title}</h1>
      </div>
      {note ? <p className="module-note">{note}</p> : null}
    </header>
  )
}
