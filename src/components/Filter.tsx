// src/components/Filter.tsx
import React from 'react';
import { FaListCheck } from 'react-icons/fa6';
import { TfiLayoutColumn3 } from 'react-icons/tfi';

const Filter: React.FC = () => {
  return (
    <>
      <button className="listView">
        <FaListCheck />
        List
      </button>
      <button className="gridView">
        <TfiLayoutColumn3 />
        List
      </button>
    </>
  );
};

export default Filter;
