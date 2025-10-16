import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
      <div className="footer-social">
        <a href="https://linkedin.com" aria-label="LinkedIn">
          LinkedIn
        </a>
        <a href="https://twitter.com" aria-label="Twitter">
          Twitter
        </a>
      </div>
      <p className="copyright">&copy; {new Date().getFullYear()} EdGenAI</p>
    </footer>
  );
}
