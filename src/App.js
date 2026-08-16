import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSunnyOutline, IoMoonOutline, IoClose, IoSearch, IoTimeOutline } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';

const GridCursorBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);
  const trails = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
      
      const cellSize = 40;
      const x = Math.floor(mousePos.current.x / cellSize);
      const y = Math.floor(mousePos.current.y / cellSize);
      
      trails.current.push({
        x,
        y,
        alpha: 1,
        hue: Math.random() * 60 - 30
      });
      
      if (trails.current.length > 15) {
        trails.current.shift();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cellSize = 40;
      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${darkMode ? '0.05' : '0.03'})`;
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cellSize;
          const y = j * cellSize;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
      
      for (let i = trails.current.length - 1; i >= 0; i--) {
        const trail = trails.current[i];
        const x = trail.x * cellSize;
        const y = trail.y * cellSize;
        
        const hue = 12 + trail.hue;
        const color = `hsla(${hue}, 80%, 60%, ${trail.alpha})`;
        
        ctx.fillStyle = color;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        ctx.shadowBlur = 0;
        
        trail.alpha -= 0.03;
        
        if (trail.alpha <= 0) {
          trails.current.splice(i, 1);
        }
      }
      
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef}
      className="grid-cursor-canvas"
    />
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fadePlaceholder, setFadePlaceholder] = useState(false);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const searchContainerRef = useRef(null);

  const placeholderTexts = [
    "Search top rated CEOs",
    "Search Fortune 500 companies",
    "Search most innovative startups",
    "Search wealthiest entrepreneurs",
    "Search market trends",
    "Search business leaders",
    "Search investment opportunities"
  ];

  useEffect(() => {
    const currentRef = searchContainerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadePlaceholder(true);
      setTimeout(() => {
        setPlaceholderIndex((prevIndex) => 
          (prevIndex + 1) % placeholderTexts.length
        );
        setFadePlaceholder(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderTexts.length]);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const rawUrl = `https://gnews.io/api/v4/top-headlines?category=business&lang=en&max=3&apikey=${process.env.REACT_APP_GNEWS_API_KEY}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          setFeaturedArticles(data.articles);
        } else {
          throw new Error('No articles returned from GNews');
        }
      } catch (error) {
        console.warn('GNews API unavailable, using fallback data:', error);
        setFeaturedArticles([
          {
            title: "Global Markets Reach Record High",
            description: "Stock markets worldwide hit all-time highs amid economic recovery.",
            image: "https://placehold.co/1200x600/111/fff?text=Forbes+Top+Story",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Forbes Staff" }
          },
          {
            title: "Tech Giants Announce New AI Partnerships",
            description: "Major technology companies form alliances to advance artificial intelligence research.",
            image: "https://placehold.co/600x400/111/fff?text=Forbes+Tech",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Forbes Tech" }
          },
          {
            title: "Economic Forecast Shows Strong Growth",
            description: "Analysts predict robust economic expansion in the coming quarter.",
            image: "https://placehold.co/600x400/111/fff?text=Financial+Times",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Financial Times" }
          }
        ]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        const rawUrl = `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=5&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const data = await response.json();
        if (data.status === 'ok' && data.articles) {
          setNewsArticles(data.articles);
          setLastUpdated(new Date());
        } else {
          throw new Error('NewsAPI failed to return valid news response');
        }
      } catch (error) {
        console.warn('NewsAPI unavailable, using fallback data:', error);
        setNewsArticles([
          {
            title: "Breaking: Major Merger Announcement",
            description: "Two industry giants announce historic merger deal worth billions.",
            url: "#",
            urlToImage: "https://placehold.co/600x400/111/fff?text=Business+Insider",
            publishedAt: new Date().toISOString(),
            source: { name: "Business Insider" }
          },
          {
            title: "New Regulations Impact Tech Sector",
            description: "Government announces new policies that will affect major tech companies.",
            url: "#",
            urlToImage: "https://placehold.co/600x400/111/fff?text=TechCrunch",
            publishedAt: new Date().toISOString(),
            source: { name: "TechCrunch" }
          },
          {
            title: "Stock Market Hits All-Time High",
            description: "Major indices reach record levels amid economic optimism.",
            url: "#",
            urlToImage: "https://placehold.co/600x400/111/fff?text=Wall+Street+Journal",
            publishedAt: new Date().toISOString(),
            source: { name: "Wall Street Journal" }
          }
        ]);
        setLastUpdated(new Date());
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNewsArticles();
    const interval = setInterval(fetchNewsArticles, 300000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleSearchClick = () => {
    if (searchContainerRef.current) {
      const inputEl = searchContainerRef.current.querySelector('input');
      if (inputEl) inputEl.focus();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Today";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const menuItems = [
    'Business',
    'Investing',
    'Technology',
    'Entrepreneurs',
    'Leadership',
    'Lifestyle',
    'Lists'
  ];

  return (
    <div className={`forbes-container ${darkMode ? 'dark-mode' : ''}`}>
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          >
            <motion.div 
              className="menu-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-menu" onClick={toggleMenu}>
                <IoClose size={28} />
              </button>
              <ul className="mobile-menu-items">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 300
                    }}
                    onClick={toggleMenu}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="top-nav glass-blur">
        <div className="nav-left">
          <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? 'moon' : 'sun'}
                className="toggle-icon glass-blur"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {darkMode ? (
                  <IoMoonOutline size={20} />
                ) : (
                  <IoSunnyOutline size={20} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="forbes-logo">FORBES</span>
        </div>

        <div 
          className="search-container" 
          ref={searchContainerRef}
          onClick={handleSearchClick}
        >
          <IoSearch className="search-icon" size={18} />
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className={`search-input ${fadePlaceholder ? 'placeholder-fade' : ''}`}
              placeholder={placeholderTexts[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="nav-right">
          <button className="menu-button" onClick={toggleMenu}>
            <GiHamburgerMenu size={24} />
          </button>
        </div>
      </nav>

      {/* Grid Cursor Section */}
      <div className="grid-cursor-container">
        <GridCursorBackground darkMode={darkMode} />
        <div className="welcome-message">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            "Welcome to Forbes Broadcast"
          </motion.h1>
        </div>
      </div>

      <div className="main-content">
        {isVisible && (
          <>
            <div className="featured-section">
              {loadingFeatured ? (
                <div className="loading-spinner">Loading featured articles...</div>
              ) : (
                <>
                  <div className="featured-article">
                    <a href={featuredArticles[0]?.url || "#"} className="featured-link">
                      <div className="featured-image">
                        <img 
                          src={featuredArticles[0]?.image || featuredArticles[0]?.urlToImage || 'https://placehold.co/1200x600/111/fff?text=Forbes+News'} 
                          alt={featuredArticles[0]?.title || 'Featured Story'} 
                          loading="lazy"
                        />
                      </div>
                      <div className="featured-text">
                        <span className="category-tag">TOP STORY</span>
                        <h1>{featuredArticles[0]?.title || "Featured Article"}</h1>
                        <p className="excerpt">
                          {featuredArticles[0]?.description || "Loading article description..."}
                        </p>
                        <div className="author-info">
                          <span className="author">{featuredArticles[0]?.source?.name || "Forbes"}</span>
                          <span className="date">
                            {formatDate(featuredArticles[0]?.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="secondary-articles">
                    {featuredArticles.slice(1, 3).map((article, index) => (
                      <motion.div 
                        className="article-card" 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <a href={article.url || "#"} className="article-link">
                          <div className="article-image-container">
                            <img 
                              src={article.image || article.urlToImage || 'https://placehold.co/600x400/111/fff?text=Forbes+News'} 
                              alt={article.title}
                              loading="lazy"
                            />
                          </div>
                          <div className="article-content">
                            <span className="category-tag">
                              {['BUSINESS', 'TECHNOLOGY'][index] || 'INVESTING'}
                            </span>
                            <h3>{article.title}</h3>
                            <div className="author-info">
                              <span className="author">{article.source?.name || "Forbes"}</span>
                              <span className="date">{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="news-feed-section">
              <div className="section-header">
                <h2>Latest Business News</h2>
                {lastUpdated && (
                  <div className="update-indicator">
                    <IoTimeOutline className="update-icon" />
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              
              {loadingNews ? (
                <div className="loading-spinner">Loading news feed...</div>
              ) : (
                <div className="news-feed-grid">
                  {newsArticles.map((article, index) => (
                    <motion.div
                      className="news-card"
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a href={article.url || "#"} target="_blank" rel="noopener noreferrer" className="news-link">
                        <div className="news-image-container">
                          <img 
                            src={article.urlToImage || article.image || 'https://placehold.co/600x400/111/fff?text=Forbes+News'} 
                            alt={article.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="news-content">
                          <h3 className="news-title">{article.title}</h3>
                          <p className="news-excerpt">
                            {article.description || 'No description available.'}
                          </p>
                          <div className="news-meta">
                            <span className="news-source">{article.source?.name || "Forbes"}</span>
                            <span className="news-date">
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <motion.div 
              className="newsletter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2>Sign up for the Forbes Daily Newsletter</h2>
              <p>Top stories and expert analysis in your inbox.</p>
              <div className="signup-form">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <footer className="forbes-footer">
        <div className="footer-links">
          <div className="footer-column">
            <h4>Forbes</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Advertise</h4>
            <ul>
              <li>Ad Choices</li>
              <li>Sponsor Content</li>
              <li>Forbes Agency Council</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Connect</h4>
            <ul>
              <li>Contact Us</li>
              <li>Newsletters</li>
              <li>Social Media</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Forbes Media LLC. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;