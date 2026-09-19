import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { productService } from '../services/api';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ShopPage({ categories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('');

  // Fetch products whenever params change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await productService.getProducts({
          category: currentCategory,
          search: currentSearch,
          sort: currentSort,
          max_price: priceFilter || undefined,
          page: currentPage,
          limit: 16
        });

        setProducts(res.data?.data || []);
        if (res.data?.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to load collection products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage, priceFilter]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      newParams.set('search', localSearch.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle Category Pill Click
  const handleCategorySelect = (catSlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (catSlug) {
      newParams.set('category', catSlug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle Sort Change
  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle Page Navigation
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px 36px' }}>
      {/* Category Banner Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span style={{
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#C5A059'
        }}>
          {activeCategoryObj ? `1 Gram Gold-Plated ${activeCategoryObj.name}` : 'All Collections'}
        </span>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.3rem, 4vw, 1.85rem)',
          color: '#520612',
          fontWeight: 700,
          marginTop: '4px'
        }}>
          {activeCategoryObj ? `Men's ${activeCategoryObj.name} Designs` : "Men's 1 Gram Gold-Plated Jewellery"}
        </h1>
        <p style={{ fontSize: '0.80rem', color: '#6B635B', marginTop: '4px' }}>
          Discover rich, lightweight everyday pieces crafted with 1 gram gold plating.
        </p>
      </div>

      {/* Search in this collection input */}
      <form onSubmit={handleSearchSubmit} style={{ maxWidth: '480px', margin: '0 auto 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #D4C9BC',
          borderRadius: '9999px',
          padding: '6px 14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <Search size={16} color="#8E857C" style={{ marginRight: '8px' }} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search in this collection..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.86rem',
              color: '#1F1A17',
              outline: 'none'
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                setSearchParams(newParams);
              }}
              style={{ background: 'none', border: 'none', color: '#8E857C', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '14px',
          justifyContent: categories.length > 5 ? 'flex-start' : 'center'
        }}
      >
        <button
          onClick={() => handleCategorySelect('')}
          style={{
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: !currentCategory ? '1.5px solid #520612' : '1px solid #D4C9BC',
            backgroundColor: !currentCategory ? '#520612' : '#FFFFFF',
            color: !currentCategory ? '#FFFFFF' : '#1F1A17',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: currentCategory === cat.slug ? '1.5px solid #520612' : '1px solid #D4C9BC',
              backgroundColor: currentCategory === cat.slug ? '#520612' : '#FFFFFF',
              color: currentCategory === cat.slug ? '#FFFFFF' : '#1F1A17',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Controls Bar: Item count & Sort dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px 14px',
        borderBottom: '1px solid #E8E2D9',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '0.80rem', color: '#6B635B' }}>
          Showing <strong>{products.length}</strong> of <strong>{pagination.totalItems}</strong> pieces
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.76rem', color: '#8E857C', display: 'none' }} className="desktop-nav">
            Sort by:
          </label>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D4C9BC',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '0.76rem',
              color: '#1F1A17',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Bestsellers</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid Area (2-column mobile, 3-4 desktop) */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 16px', color: '#8E857C' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.05rem', color: '#1F1A17', fontWeight: 600, marginBottom: '6px' }}>
            No jewellery pieces found
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
            Try clearing your search query or selecting another category.
          </p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSearchParams(new URLSearchParams());
            }}
            className="btn-maroon"
            style={{ padding: '8px 20px', fontSize: '0.82rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #D4C9BC',
              backgroundColor: '#FFFFFF',
              color: currentPage <= 1 ? '#D4C9BC' : '#520612',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: currentPage === pageNum ? '1.5px solid #520612' : '1px solid #D4C9BC',
                  backgroundColor: currentPage === pageNum ? '#520612' : '#FFFFFF',
                  color: currentPage === pageNum ? '#FFFFFF' : '#1F1A17',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #D4C9BC',
              backgroundColor: '#FFFFFF',
              color: currentPage >= pagination.totalPages ? '#D4C9BC' : '#520612',
              cursor: currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
