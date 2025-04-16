import React from 'react';

interface HeadingProps {
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <div className='px-32'>
      <p className='text-3xl capitalize p-2 font-extrabold tracking-tight text-slate-900'>
        {title}
      </p>
    </div>
  );
};

export default Heading;
