import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "CCUC AV Team",
    template: "%s — CCUC AV Team",
  },
  description:
    "The CCUC AV team: who we are, what we do, and how to request AV support.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
