export default function AnimatedLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="https://cdn.imageurlgenerator.com/uploads/6949427b-10bc-41ae-9588-1228f9e1b80c.gif"
      alt="GalaxyBoosts"
      className={`rounded-full object-cover border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.35)] ${className}`}
    />
  );
}
