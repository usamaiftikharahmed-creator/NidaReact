import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function Admin() {
    const navigate = useNavigate();
    const fileRef = useRef();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "" });
    const [confirmId, setConfirmId] = useState(null);
    const [preview, setPreview] = useState(null);

    const emptyForm = { id: null, name: "", price: "", image: null };

    const [form, setForm] = useState(emptyForm);
    const [editMode, setEditMode] = useState(false);

    /* ============ TOAST ============ */
    const showToast = (msg, type = "success") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
    };

    /* ============ LOAD PRODUCTS ============ */
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch {
            showToast("Failed to load products", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* ============ INPUT ============ */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    /* ============ ADD ============ */
    const addProduct = async () => {
        if (!form.name || !form.price) {
            return showToast("Name and price are required", "error");
        }

        const data = new FormData();
        data.append("name", form.name);
        data.append("price", form.price);
        if (form.image) data.append("image", form.image);

        try {
            const res = await axios.post("http://localhost:5000/api/products", data);
            setProducts([res.data, ...products]);
            resetForm();
            showToast("Product added!");
        } catch {
            showToast("Failed to add product", "error");
        }
    };

    /* ============ DELETE ============ */
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter((p) => p._id !== id));
            setConfirmId(null);
            showToast("Product deleted!");
        } catch {
            showToast("Failed to delete", "error");
        }
    };

    /* ============ EDIT ============ */
    const editProduct = (p) => {
        setForm({
            id: p._id,
            name: p.name,
            price: p.price,
            image: null
        });
        setPreview(p.image); // Shows the Cloudinary URL image
        setEditMode(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ============ UPDATE ============ */
    const updateProduct = async () => {
        if (!form.name || !form.price) {
            return showToast("Name and price are required", "error");
        }

        const data = new FormData();
        data.append("name", form.name);
        data.append("price", form.price);
        if (form.image) data.append("image", form.image);

        try {
            const res = await axios.put(
                `http://localhost:5000/api/products/${form.id}`,
                data
            );
            setProducts(
                products.map((p) => (p._id === form.id ? res.data : p))
            );
            resetForm();
            showToast("Product updated!");
        } catch {
            showToast("Failed to update product", "error");
        }
    };

    /* ============ RESET ============ */
    const resetForm = () => {
        setForm(emptyForm);
        setEditMode(false);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    /* ============ LOGOUT ============ */
    const logout = () => navigate("/");

    return (
        <div style={s.page}>
            <Navbar />

            {/* TOAST */}
            {toast.show && (
                <div
                    style={{
                        ...s.toast,
                        background: toast.type === "error" ? "#e74c3c" : "#00c6ff",
                        color: toast.type === "error" ? "#fff" : "#000"
                    }}
                >
                    {toast.msg}
                </div>
            )}

            {/* CONFIRM MODAL */}
            {confirmId && (
                <div style={s.modalOverlay}>
                    <div style={s.modal}>
                        <h3 style={{ margin: "0 0 10px" }}>Delete Product?</h3>
                        <p style={{ color: "#aaa", margin: "0 0 20px" }}>
                            This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button style={s.modalCancel} onClick={() => setConfirmId(null)}>
                                Cancel
                            </button>
                            <button style={s.modalDelete} onClick={() => deleteProduct(confirmId)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div style={s.header}>
                <div>
                    <h1 style={s.headerTitle}>Admin Dashboard</h1>
                    <p style={s.headerSub}>Manage your products here</p>
                </div>
                <button style={s.logoutBtn} onClick={logout}>
                    Logout
                </button>
            </div>

            {/* FORM SECTION */}
            <div style={s.formCard}>
                <h2 style={s.formTitle}>
                    {editMode ? "✏️ Edit Product" : "➕ Add Product"}
                </h2>

                <div style={s.formGrid}>
                    {/* LEFT — INPUTS */}
                    <div style={s.formLeft}>
                        <label style={s.label}>Product Name</label>
                        <input
                            name="name"
                            placeholder="e.g. Nike Air Max"
                            value={form.name}
                            onChange={handleChange}
                            style={s.input}
                        />

                        <label style={s.label}>Price ($)</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="e.g. 120"
                            value={form.price}
                            onChange={handleChange}
                            style={s.input}
                        />

                        <label style={s.label}>Product Image</label>
                        <div style={s.fileWrap}>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                style={s.fileInput}
                            />
                            <div style={s.filePlaceholder}>
                                {form.image
                                    ? form.image.name
                                    : editMode
                                    ? "Click to change image"
                                    : "Click to upload image"}
                            </div>
                        </div>

                        <div style={s.btnRow}>
                            {editMode ? (
                                <>
                                    <button style={s.updateBtn} onClick={updateProduct}>
                                        Update Product
                                    </button>
                                    <button style={s.cancelBtn} onClick={resetForm}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button style={s.addBtn} onClick={addProduct}>
                                    Add Product
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — PREVIEW */}
                    <div style={s.formRight}>
                        <p style={s.previewLabel}>Image Preview</p>
                        {preview ? (
                            <img src={preview} alt="Preview" style={s.previewImg} />
                        ) : (
                            <div style={s.noPreview}>
                                <span style={{ fontSize: "40px" }}>🖼️</span>
                                <p>No image selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRODUCT LIST */}
            <div style={s.listSection}>
                <h2 style={s.listTitle}>All Products ({products.length})</h2>

                {loading ? (
                    <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>
                ) : products.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#888" }}>
                        No products yet. Add one above!
                    </p>
                ) : (
                    <div style={s.grid}>
                        {products.map((p) => (
                            <div key={p._id} style={s.card}>
                                <div style={s.cardImgWrap}>
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        style={s.cardImg}
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/300x200?text=No+Image";
                                        }}
                                    />
                                </div>
                                <div style={s.cardBody}>
                                    <h3 style={s.cardName}>{p.name}</h3>
                                    <p style={s.cardPrice}>${p.price}</p>
                                    <div style={s.cardActions}>
                                        <button style={s.editBtn} onClick={() => editProduct(p)}>
                                            ✏️ Edit
                                        </button>
                                        <button style={s.delBtn} onClick={() => setConfirmId(p._id)}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* =================== STYLES =================== */
const s = {
    page: { background: "#0b0f19", minHeight: "100vh", color: "#fff", fontFamily: "'Segoe UI', Arial, sans-serif" },
    toast: { position: "fixed", top: "20px", right: "20px", padding: "14px 24px", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 },
    modal: { background: "#1a2235", padding: "30px", borderRadius: "16px", textAlign: "center", maxWidth: "380px", width: "90%" },
    modalCancel: { padding: "10px 22px", background: "#333", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
    modalDelete: { padding: "10px 22px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 40px", borderBottom: "1px solid #1e293b" },
    headerTitle: { margin: 0, fontSize: "28px" },
    headerSub: { margin: "4px 0 0", color: "#64748b", fontSize: "14px" },
    logoutBtn: { background: "transparent", border: "2px solid #e74c3c", color: "#e74c3c", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    formCard: { background: "#111827", margin: "30px 40px", borderRadius: "16px", padding: "30px", border: "1px solid #1e293b" },
    formTitle: { margin: "0 0 24px", fontSize: "20px" },
    formGrid: { display: "flex", gap: "30px", flexWrap: "wrap" },
    formLeft: { flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "6px" },
    formRight: { flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center" },
    label: { fontSize: "13px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "8px" },
    input: { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #1e293b", background: "#0b0f19", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box" },
    fileWrap: { position: "relative", overflow: "hidden", borderRadius: "8px" },
    fileInput: { position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 2 },
    filePlaceholder: { padding: "12px 14px", background: "#0b0f19", border: "1px dashed #334155", borderRadius: "8px", color: "#64748b", fontSize: "14px", textAlign: "center" },
    previewLabel: { color: "#94a3b8", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" },
    previewImg: { width: "100%", maxWidth: "320px", height: "200px", objectFit: "cover", borderRadius: "12px", border: "2px solid #1e293b" },
    noPreview: { width: "100%", maxWidth: "320px", height: "200px", border: "2px dashed #1e293b", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#475569" },
    btnRow: { display: "flex", gap: "10px", marginTop: "16px" },
    addBtn: { padding: "12px 28px", background: "linear-gradient(135deg, #00c6ff, #0072ff)", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "15px" },
    updateBtn: { padding: "12px 28px", background: "linear-gradient(135deg, #f7971e, #ffd200)", border: "none", borderRadius: "8px", color: "#000", fontWeight: "bold", cursor: "pointer", fontSize: "15px" },
    cancelBtn: { padding: "12px 28px", background: "transparent", border: "1px solid #475569", borderRadius: "8px", color: "#94a3b8", cursor: "pointer", fontSize: "15px" },
    listSection: { padding: "10px 40px 40px" },
    listTitle: { fontSize: "20px", marginBottom: "20px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
    card: { background: "#111827", borderRadius: "14px", overflow: "hidden", border: "1px solid #1e293b" },
    cardImgWrap: { width: "100%", height: "200px", overflow: "hidden" },
    cardImg: { width: "100%", height: "100%", objectFit: "cover" },
    cardBody: { padding: "16px" },
    cardName: { margin: "0 0 4px", fontSize: "16px" },
    cardPrice: { margin: "0 0 14px", color: "#00c6ff", fontWeight: "bold", fontSize: "18px" },
    cardActions: { display: "flex", gap: "8px" },
    editBtn: { flex: 1, padding: "9px", background: "#1e293b", border: "none", borderRadius: "8px", color: "#fbbf24", cursor: "pointer", fontWeight: "bold", fontSize: "13px" },
    delBtn: { flex: 1, padding: "9px", background: "#1e293b", border: "none", borderRadius: "8px", color: "#ef4444", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }
};
