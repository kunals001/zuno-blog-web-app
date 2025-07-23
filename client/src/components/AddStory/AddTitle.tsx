import React from 'react'

interface Props {
  Title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>
}

const AddTitle: React.FC<Props> = ({ Title, setTitle }) => {
  return (
    <div className='w-full relative'>
      <input
        type="text"
        placeholder='Title Of Your Story'
        value={Title ?? ''}
        onChange={(e) => setTitle(e.target.value)}
        className='
          w-full
          bg-transparent
          text-zinc-700 dark:text-zinc-200
          placeholder:text-zinc-500 dark:placeholder:text-zinc-400
          text-[3vh] md:text-[2.5vw]
          outline-none
          border-none
          caret-[#6366f1] caret-w-[3vw]
          peer
        '
      />
      {/* Animated bottom border */}
      <span className='
        absolute
        left-0 bottom-0
        h-[2px]
        w-0
        bg-[#6366f1]
        transition-all
        duration-300
        peer-focus:w-full
        peer-focus:scale-100
        rounded-full
      ' />
    </div>
  )
}

export default AddTitle
