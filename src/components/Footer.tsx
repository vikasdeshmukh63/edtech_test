import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Developed by{' '}
            <span className="font-bold text-gray-800 dark:text-white">
              Vikas Deshmukh
            </span>
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="https://github.com/vikasdeshmukh63"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/vikas-deshmukh-fullstackdeveloper/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
