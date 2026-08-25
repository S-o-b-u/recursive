export default function Hero() {
  return (
    <section id="hero" className="hero-root">
      {/* Background Video */}
      <div className="hero-bg-container" aria-hidden="true">
        <video
          className="hero-video"
          src="/bg/hero_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <style>{`
        .hero-root {
          height: 100dvh;
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </section>
  );
}
