import Typography from "@mui/material/Typography";

const Footer = () => (
  <footer style={{ position: "relative", clear: "both", textAlign: "right" }}>
    <Typography
      variant="subtitle2"
      noWrap
      sx={{ marginRight: 2, marginBottom: 2 }}
    >
      Made with 📖 by <a href="https://benjamincongdon.me">Ben Congdon</a>,
      2022.
    </Typography>
  </footer>
);

export default Footer;
