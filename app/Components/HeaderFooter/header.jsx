"use client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';

function Header() {
    return (
        <>
            <header className="bg-blue-600 text-white shadow-md fixed top-0 z-50 w-full py-2 kanit-regular">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="bg-white text-green-600 p-1 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2zm-6.4 12h-2.2L8 11l2.9-3h2.1L10 11zm3.9 0h1.7L15 11l2.1-3h-1.7L14 9.5z" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold">ExcelValidate</span>
                    </div>

                    <nav className="hidden md:flex space-x-6">
                        <a href="/" className="hover:text-blue-300 flex items-center">
                            <i className="fas fa-home mr-2"></i> หน้าแรก
                        </a>
                        <Link
                            to="/template"
                            className="hover:text-blue-300 flex items-center"
                        >
                            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                            เทมเพลต
                        </Link>
                        <a href="#about" className="hover:text-blue-300 flex items-center">
                            <i className="fas fa-info-circle mr-2"></i> คำแนะนำการใช้งาน
                        </a>
                    </nav>

                    <div className="md:hidden">
                        <button className="text-white focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
