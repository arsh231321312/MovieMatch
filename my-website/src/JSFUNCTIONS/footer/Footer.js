 import React from "react";
import "../../App.css";

const Footer = () => {
  const team = [
    {
      name: "Arshdeep Sandhu",
      linkedin: "https://www.linkedin.com/in/arshdeep-sandhu-8a95a12b8/",
    },
    {
      name: "Katherine Raguini",
      linkedin: "https://www.linkedin.com/in/katherine-raguini-student/",
    },
    {
      name: "Reynaldo Guerra",
      linkedin: "https://www.linkedin.com/in/reynaldo-guerra/",
    },
  ];

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>Connect with the MovieMatch team:</p>
      <ul style={styles.list}>
        {team.map((member, index) => (
          <li key={index} style={styles.listItem}>
            <a
              href={member.linkedin}
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {member.name}
            </a>
          </li>
        ))}
      </ul>
      <p style={styles.copyright}>© {new Date().getFullYear()} MovieMatch</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
  },
  text: {
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  listItem: {},
  link: {
    color: "#00aaff",
    textDecoration: "none",
  },
  copyright: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#aaa",
  },
};

export default Footer;
