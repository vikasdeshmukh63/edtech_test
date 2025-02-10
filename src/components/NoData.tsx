import { FolderX } from 'lucide-react';

const NoData = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <FolderX className="w-10 h-10 text-gray-500 dark:text-gray-300" />
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  );
};

export default NoData;
