// src/components/Filter.tsx
import React from 'react';
import { FaListCheck } from 'react-icons/fa6';
import { TfiLayoutColumn3 } from 'react-icons/tfi';

const Filter: React.FC = () => {
  return (
    <>
      {/* Top Strip with List/Grid buttons */}
      <div className="topStrip flex gap-4 mb-6">
        <button className="listView flex justify-center items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
          <FaListCheck />
          <span className="text-sm font-medium">List</span>
        </button>
        <button className="gridView flex justify-center items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
          <TfiLayoutColumn3 />
          <span className="text-sm font-medium">Grid</span>
        </button>
      </div>

      {/* Bottom Strip with Filters and Search */}
      <div className="bottomStrip flex flex-col md:flex-row gap-4 justify-between items-center px-4">
        {/* Category and Due Date Filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label
              htmlFor="category"
              className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
            >
              Filter by Category:
            </label>
            <select
              name="category"
              id="category"
              className="p-2 lg:px-3 lg:py-2 w-8/12 md:w-auto text-sm lg:text-lg border rounded-3xl bg-white dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="All">All</option>
              <option value="todo">Todo</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="due-date"
              className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
            >
              Due Date:
            </label>
            <select
              name="due-date"
              id="due-date"
              className="p-2 lg:px-3 lg:py-2 w-9/12 md:w-auto text-sm lg:text-lg border rounded-3xl bg-white dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="All">All</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
        </div>

        {/* Search and Add Task Button */}
        <div className="flex justify-center md:justify-normal gap-4 w-full md:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            className="p-2 lg:px-3 lg:py-2 text-sm lg:text-lg border rounded-3xl bg-white dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-7/12 md:w-auto"
            placeholder="Search tasks..."
          />
          <button className="p-2 lg:px-3 lg:py-2 text-sm lg:text-lg bg-blue-500 text-white rounded-3xl hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all w-4/12 md:w-auto">
            Add Task
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
