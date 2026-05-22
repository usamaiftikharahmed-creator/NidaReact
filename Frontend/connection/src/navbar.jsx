import React from "react";

export default function Navbar() {
    return (
        <header style={styles.header}>

            {/* LOGO */}
            <h1 style={styles.logo}>
                ShopEase
            </h1>

            {/* NAV LINKS */}
            <nav>
                <a href="#" style={styles.navLink}>
                    Home
                </a>

                <a href="#" style={styles.navLink}>
                    Products
                </a>

                <a href="#" style={styles.navLink}>
                    Categories
                </a>

                <a href="#" style={styles.navLink}>
                    Contact
                </a>
            </nav>

        </header>
    );
}

/* STYLES */
const styles = {

    header: {
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    logo: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    navLink: {
        color: "#fff",
        marginLeft: "25px",
        textDecoration: "none",
        fontSize: "16px",
        transition: "0.3s"
    }

};