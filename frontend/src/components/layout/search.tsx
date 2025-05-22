import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { ChevronLeft, Search, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { Product } from "../../type";
import { search } from "../../services/search";
import { formatPrice } from "../../pages/client/complete-order";

interface SearchBarProps {
    isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
    const [query, setQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const isTyping = false
    // const { searchResults, setSearchQuery, isTyping, clearSearch } = useSearchPosts();
    const [results, setResults] = useState<Product[]>([])
    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                const { success, data, message } = await search({ query, page: 1, limit: 10 })
                if (success) {
                    setResults(data)
                } else {
                    alert(message)
                }
            }
        }
        fetchResults()
    }, [query])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        // setSearchQuery(value);
    };

    const handleCollapseSearch = () => {
        setIsSearchExpanded(false);
        // clearSearch();
        setQuery("");
    };




    // Animation variants for search expansion
    const searchExpandAnimation = {
        collapsed: {
            width: "40px",
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.1,
            }
        },
        expanded: {
            width: "100%",
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.1,
            }
        }
    };

    const searchContainerAnimation = {
        collapsed: {
            backgroundColor: "",
            backdropFilter: "",
        },
        expanded: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            transition: {
                type: "spring",
                duration: 0.1,
            }
        }
    };

    const backButtonAnimation = {
        initial: {
            x: -20,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                duration: 0.2,
            }
        },
        exit: {
            x: -10,
            opacity: 0,
            transition: {
                duration: 0.2,
            }
        }
    };

    return (
        <motion.div
            className={clsx(
                "flex justify-center",
                !isMobile && "flex-1 px-4 max-w-2xl mx-auto",
                isMobile && !isSearchExpanded && "ml-auto pr-4",
                isMobile && isSearchExpanded && "absolute inset-0 px-2"
            )}
            animate={isMobile && isSearchExpanded ? "expanded" : "collapsed"}
            variants={searchContainerAnimation}
        >
            <AnimatePresence mode="wait">
                {isSearchVisible && (
                    <motion.div
                        className={clsx(
                            "relative flex items-center",
                            // !isMobile && "w-full max-w-2xl"
                        )}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            width: isMobile && isSearchExpanded ? "100%" : "auto",
                        }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                        }}
                    >
                        <div className="relative flex items-center">


                            <AnimatePresence mode="wait">
                                {isMobile && isSearchExpanded && (
                                    <motion.button
                                        onClick={handleCollapseSearch}
                                        className="p-2 mr-2 rounded-lg hover:bg-gray-100"
                                        {...backButtonAnimation}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <motion.div
                                className="relative flex w-full justify-center items-center"
                                variants={searchExpandAnimation}
                                initial="collapsed"
                                animate={isMobile ? (isSearchExpanded ? "expanded" : "collapsed") : "expanded"}
                            >
                                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                <motion.input
                                    type="text"
                                    value={query}
                                    onChange={handleSearchChange}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className={clsx("w-full py-2 bg-gray-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-sm placeholder:text-gray-400",
                                        isMobile && "pl-10 pr-10",
                                        !isMobile && "pl-10 pr-60"
                                    )}
                                    layoutId="search-input"
                                />
                                {query && (
                                    <motion.button
                                        onClick={() => {
                                            setQuery("");

                                        }}
                                        className="absolute right-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </motion.div>


                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {query && results && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                    }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-[480px] overflow-y-auto overflow-x-hidden z-50 divide-y divide-gray-100"
                                >
                                    {/* Loading State */}
                                    {isTyping && (
                                        <motion.div
                                            className="p-4 text-center text-sm text-gray-500"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="animate-pulse flex justify-center items-center gap-2">
                                                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Results */}
                                    {results.map((result, index) => (
                                        <Link
                                            to={`/products/detail/${result.slug}`}
                                            key={result.id}
                                            onClick={() => {
                                                setIsSearchVisible(false);
                                                setIsSearchExpanded(false);
                                                setTimeout(() => {

                                                    setQuery("");
                                                    setIsSearchVisible(true);
                                                }, 300);
                                            }}
                                        >
                                            <motion.button
                                                className="w-full p-3 text-left overflow-y-auto overflow-x-hidden hover:bg-gray-200 transition-colors flex items-start gap-3 group"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={result.thumbnail}
                                                        alt={result.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1 justify-between min-w-0">

                                                    <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                                                        {result.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                                        {result.shortDescription}
                                                    </p>
                                                    <p className="text-xs text-green-700  line-clamp-2">{formatPrice(result.price)}</p>

                                                </div>
                                            </motion.button>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SearchBar;
