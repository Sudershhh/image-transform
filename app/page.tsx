export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      {/* Hero Section */}
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        {/* Main Heading - Sans Serif (System) */}
        <h1 className="font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Welcome to Image Transform
        </h1>

        {/* Subtitle - Serif (Merriweather) */}
        <p className="mx-auto max-w-2xl font-serif text-xl text-muted-foreground sm:text-2xl">
          Transform your images with ease. A modern solution for all your image
          processing needs.
        </p>

        {/* Code Example - Monospace (JetBrains Mono) */}
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 text-left">
          <code className="font-mono text-sm text-card-foreground">
            <span className="text-muted-foreground">{`// Example usage`}</span>
            <br />
            <span className="text-primary">const</span>{" "}
            <span className="text-accent-foreground">result</span> ={" "}
            <span className="text-primary">await</span>{" "}
            <span className="text-accent-foreground">transform</span>(
            <span className="text-destructive">image</span>);
          </code>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-md bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Get Started
          </button>
          <button className="rounded-md border border-border bg-secondary px-6 py-3 font-sans text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
            Learn More
          </button>
        </div>

        {/* Font Showcase */}
        <div className="mt-16 space-y-4 rounded-lg border border-border bg-card p-8">
          <h2 className="font-serif text-2xl font-bold text-card-foreground">
            Font Showcase
          </h2>
          <div className="space-y-3 text-left">
            <p className="font-sans text-base text-muted-foreground">
              <span className="font-semibold">Sans Serif (System):</span> The
              quick brown fox jumps over the lazy dog. 1234567890
            </p>
            <p className="font-serif text-base text-muted-foreground">
              <span className="font-semibold">Serif (Merriweather):</span> The
              quick brown fox jumps over the lazy dog. 1234567890
            </p>
            <p className="font-mono text-base text-muted-foreground">
              <span className="font-semibold">Monospace (JetBrains Mono):</span>{" "}
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
