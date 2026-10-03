import RevealObserver from "@/components/reveal";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Statement from "@/components/statement";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import Shop from "@/components/shop";
import Community from "@/components/community";
import Reviews from "@/components/reviews";
import Location from "@/components/location";
import Booking from "@/components/booking";
import Footer from "@/components/footer";
import MobileActions from "@/components/mobile-actions";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <Services />
        <Gallery />
        <Shop />
        <Community />
        <Reviews />
        <Location />
        <Booking />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
