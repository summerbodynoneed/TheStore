const retroStyles = `
body {
  background: #c0c0c0;
  font-family: Verdana, Arial, sans-serif;
  color: black;
}

/* Conteneur principal */
.header-container {
  background: linear-gradient(#000080, #0000cd);
  color: white;
  padding: 10px;
  border: 3px solid black;
  box-shadow: 3px 3px 0px black;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Logo */
.header-container img {
  border: 2px solid white;
  background: white;
}

/* Titre style vieux site */
.header-container h1 {
  font-size: 22px;
  font-weight: bold;
  text-shadow: 2px 2px 0px black;
}

/* Menu navigation */
.center-text {
  background: #e0e0e0;
  border: 2px inset #fff;
  padding: 8px;
  font-size: 14px;
}

/* Liens style années 2000 */
a {
  color: blue;
  text-decoration: underline;
  font-weight: bold;
}

a:hover {
  color: red;
}

/* Effet bouton old school */
button {
  background: #dcdcdc;
  border: 2px outset #fff;
  padding: 5px 10px;
  cursor: pointer;
}

button:active {
  border: 2px inset #fff;
}

/* Option bonus : effet marquee */
.marquee {
  background: yellow;
  color: black;
  font-weight: bold;
  padding: 5px;
}
`;