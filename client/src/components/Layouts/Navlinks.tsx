import Link from 'next/link';
import React from 'react';

const Navlinks = () => {
  const Navlinks = [
    { name: 'Home', path: '/' },
    { name: 'Convert', path: '/convert' },
    { name: 'Merge', path: '/merge' },
    { name: 'Compress', path: '/compress' },
    { name: 'Resize', path: '/resize' },
  ];

  return (
    <div className="flex items-center gap-4">
      {Navlinks.map((item, index) => (
        <div
          key={index}
          className="text-zinc-700 dark:text-zinc-200 hover:text-[#0ABAB5] transition ease-in-out duration-200 text-[1.1vw] font-[400] "
        >
          <Link href={item.path}>{item.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Navlinks;
