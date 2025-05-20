import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./Nav.module.css";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { text: "Mathématiques", path: "/mathematiques" },
    { text: "Français", path: "/francais" },
    { text: "OQRE", path: "/jeux" },
    { text: "Concours", path: "/Concours" },
    { text: "1e et 2e année", path: "/Revision" },
  ];

  return (
    <>
      {/* Navbar pour grand écran */}
      <AppBar position="static" className={styles.navBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>Menu</Typography>

          <div className={styles.navDesktop}>
            <ul>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={styles.navLink}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Icône menu burger pour mobile */}
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle} className={styles.menuButton}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer pour mobile */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List className={styles.drawer}>
          {navLinks.map((link, index) => (
            <ListItem button key={index} onClick={handleDrawerToggle}>
              <Link to={link.path} className={styles.drawerLink}>
                <ListItemText primary={link.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Nav;
