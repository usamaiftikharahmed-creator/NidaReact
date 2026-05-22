import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://nidareact-production.up.railway.app/api/products")
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div style={s.container}>
            <Navbar />

            {/* HERO BANNER */}
            <section style={s.hero}>
                <div style={s.heroOverlay}></div>
                <div style={s.heroContent}>
                    <h1 style={s.heroTitle}>Discover Products</h1>
                    <p style={s.heroText}>
                        Premium shoes, glasses, watches, headphones & more — all in one place.
                    </p>
                    <button
                        style={s.heroBtn}
                        onClick={() =>
                            document.getElementById("products").scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Explore Now
                    </button>
                </div>
            </section>

            {/* PRODUCTS TITLE */}
            <h2 id="products" style={s.sectionTitle}>
                Featured Products
            </h2>

            {/* LOADING */}
            {loading ? (
                <div style={s.loadingWrap}>
                    <div style={s.spinner}></div>
                    <p style={{ color: "#64748b" }}>Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div style={s.emptyWrap}>
                    <span style={{ fontSize: "50px" }}>🛒</span>
                    <h3 style={{ color: "#64748b" }}>No products yet</h3>
                    <p style={{ color: "#475569" }}>Check back soon — new items are added regularly!</p>
                </div>
            ) : (
                <div style={s.productsGrid}>
                    {products.map((p) => (
                        <div key={p._id} style={s.card}>
                            <div style={s.imgWrap}>
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    style={s.image}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300/1e293b/64748b?text=No+Image";
                                    }}
                                />
                            </div>
                            <div style={s.cardBody}>
                                <h3 style={s.cardName}>{p.name}</h3>
                                <p style={s.price}>${p.price}</p>
                                <button style={s.buyBtn}>Buy Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FOOTER */}
            <footer style={s.footer}>
                <p>© 2026 ShopEase. All rights reserved.</p>
            </footer>
        </div>
    );
}

/* =================== STYLES =================== */
const s = {
    container: { backgroundColor: "#0b0f19", color: "#fff", minHeight: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif" },
    hero: { height: "70vh", backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30')", backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
    heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.65)" },
    heroContent: { position: "relative", zIndex: 2, maxWidth: "700px", padding: "20px" },
    heroTitle: { fontSize: "55px", marginBottom: "15px" },
    heroText: { fontSize: "18px", color: "#ccc", marginBottom: "25px" },
    heroBtn: { padding: "12px 28px", background: "linear-gradient(135deg, #00c6ff, #0072ff)", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "16px" },
    sectionTitle: { textAlign: "center", margin: "40px 0 20px", fontSize: "28px" },
    loadingWrap: { textAlign: "center", padding: "60px 20px" },
    spinner: { width: "40px", height: "40px", border: "4px solid #1e293b", borderTopColor: "#00c6ff", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" },
    emptyWrap: { textAlign: "center", padding: "60px 20px" },
    productsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px", padding: "20px 40px" },
    card: { backgroundColor: "#111827", borderRadius: "14px", overflow: "hidden", border: "1px solid #1e293b" },
    imgWrap: { width: "100%", height: "230px", overflow: "hidden" },
    image: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
    cardBody: { padding: "18px" },
    cardName: { margin: "0 0 6px", fontSize: "17px" },
    price: { color: "#00c6ff", fontWeight: "bold", margin: "0 0 14px", fontSize: "20px" },
    buyBtn: { width: "100%", padding: "11px", background: "linear-gradient(135deg, #00c6ff, #0072ff)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    footer: { textAlign: "center", padding: "24px", marginTop: "50px", backgroundColor: "#05070f", color: "#64748b", fontSize: "14px" }
};
