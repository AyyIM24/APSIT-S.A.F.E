import React, { useState  } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const DiscoveryHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [items] = useState([
    { id: 1, name: "Blue HP Laptop", location: "Library 2nd Floor", date: "2026-02-14", status: "SECURED",category:"electronics" ,
      image: process.env.PUBLIC_URL + "/images/Img 1.jpg"},
    { id: 2, name: "iPhone 13", location: "Canteen", date: "2026-02-13", status: "SECURED",category:"electronics" ,
      image: process.env.PUBLIC_URL + "/images/Img 2.jpg"},
    { id: 3, name: "APSIT ID Card", location: "Lab 402", date: "2026-02-12", status: "SECURED",category:"id-cards" ,
      image: process.env.PUBLIC_URL + "/images/Img 3.jpeg"},
  ]);


  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    const matchesLocation = selectedLocation === "" || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <>
    <div className="discovery-theme-root">
      <Header isLoggedIn={true} setIsLoggedIn={() => {}} />

      <section>
          <div className="part-1">
            <h2 className="hub-title">Discovery Hub</h2>
            <div className="search-bar-themed">
              <input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="search-btn-gradient">Search</button>
            </div>
          </div>
      </section>
      
      <section id='DiscoveryHub' className='container-1'>

        <aside className='part-2'>
          <div className="sidebar-inner">
            <h3 className="filter-title">Filters</h3>
            <div className="filter-group">
              <label>Category</label>
              <select 
        className="theme-input" 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="id-cards">ID Cards</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Location</label>
             <select 
        className="theme-input" 
        value={selectedLocation} 
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
                <option value="">All Locations</option>
                <option value="library">Library</option>
                <option value="canteen">Canteen</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date Found</label>
              <input type="date" className="theme-input" />
            </div>
            <br />
            <button className="btn-gradient-card" onClick={() => {setSearchTerm(""); setSelectedCategory(""); setSelectedLocation("");}}>Reset Filters</button>
          </div>
        </aside>


      
        <div className="main-content-wrapper">
        

          

          <div className='part-3'>
            <button className="toggle-btn active-toggle">Lost Items</button>
            <button className="toggle-btn">Found Items</button>
          </div>

          <div className='part-4'>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
              <div className="theme-card" key={item.id}>
                <div className="card-image-field">
                  {item.image && <img src={item.image} alt={item.name} className="item-img-render" />}
                   <span className="status-badge">{item.status}</span>
                </div>
                <div className="card-info glass-effect">
                  <h4>{item.name}</h4>
                  <p>📍 {item.location}</p>
                  <p>📅 {item.date}</p>
                  <Link to={`/item/${item.id}`}>
  <button className="btn-gradient-card">View Details</button>
</Link>
                </div>
              </div>
            ))) : (
              <p className="no-results">No items found matching your search.</p>
            )}
          </div>
        </div>
      </section>
          <Footer/>
    </div>

    </>
  );
};

export default DiscoveryHub;