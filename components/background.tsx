import { LinearGradient } from "expo-linear-gradient";

interface BackgroundProps {
  isDark: boolean;
}

const Background = ({ isDark }: BackgroundProps) => {
  return (
    <>
      <LinearGradient
        colors={isDark ? ["#0F0A1E", "#1A0B2E", "#16213E"] : ["#ffe6e6ff", "#F8F9FA", "#F3F4F6"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      {/* Floating gradient orbs for depth */}
      {isDark && (
        <>
          <LinearGradient
            colors={["rgba(139, 92, 246, 0.3)", "transparent"]}
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: 150,
              top: -100,
              right: -50,
              opacity: 0.5,
            }}
          />
          <LinearGradient
            colors={["rgba(236, 72, 153, 0.3)", "transparent"]}
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: 125,
              bottom: 100,
              left: -80,
              opacity: 0.5,
            }}
          />
        </>
      )}
    </>
  );
};

export default Background;
