/**
 * Quick Wheel Vehicle Rental App Component
 * Component: Hero
 * Description: Main search and filter section on the homepage with search bar and category filters
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Search bar for vehicle search
 * - Category filter chips for vehicle types
 * - Triggers search and filter functions through context
 */

import { useState } from 'react';
import { useAds } from '../../contexts/AdsContext';
import styles from './Hero.module.css';
import searchIcon from '../../assets/images/iconsax-search.svg';

const categories = ['All', 'Cars', 'Scooters', 'Motor Bicycle', 'Vans', 'Large Vehicles'];

const Hero = () => {
  const [searchInput, setSearchInput] = useState('');
  const { selectedCategory, setSelectedCategory, fetchAds } = useAds();

  const handleSearch = async () => {
    await fetchAds(1, selectedCategory, searchInput);
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await fetchAds(1, category, searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            QUICK WHEEL
          </h1>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <img src={searchIcon} alt="Search" className={styles.searchIcon} />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className={styles.categoriesSection}>
            <div className={styles.categoryChips}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`${styles.categoryChip} ${
                    selectedCategory === category ? styles.active : ''
                  }`}
                >
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Down Arrow */}
          <div className={styles.downArrow}>
            <div className={styles.arrowIcon}>↓</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;