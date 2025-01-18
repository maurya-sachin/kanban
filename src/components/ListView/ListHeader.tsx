// src/components/ListView/ListHeader.tsx
import React from 'react';
import { FaSort } from 'react-icons/fa';

const ListHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg font-medium text-gray-700">
      <div className="flex items-center space-x-2">
        <span>Task Name</span>
        <FaSort className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div className="flex items-center space-x-2">
        <span>Due On</span>
        <FaSort className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div className="flex items-center space-x-2">
        <span>Task Status</span>
        <FaSort className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div className="flex items-center space-x-2">
        <span>Task Category</span>
        <FaSort className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div>
        <span>Action</span>
      </div>
    </div>
  );
};

export default ListHeader;
