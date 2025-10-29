import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { TabBarIcons } from "../TabBar/TabBarIcons";

type AvatarSize = "sm" | "md" | "xl" | "xxl" | number;

type AvatarProps = {
  imageUrl?: string | null;
  size?: AvatarSize;
  nft?: boolean;
};

const SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  sm: 32,
  md: 44,
  xl: 64,
  xxl: 84,
};

function resolveSize(size?: AvatarSize): number {
  if (!size) return SIZE_MAP.md;
  if (typeof size === "number") return size;
  return SIZE_MAP[size] ?? SIZE_MAP.md;
}

const VISUAL_OFFSET_MAP: Record<Exclude<AvatarSize, number>, number> = {
  sm: 8,
  md: 12,
  xl: 18,
  xxl: 24,
};

const FRAME_SCALE = 1.5;

function resolveOffset(size: AvatarSize): number {
  if (typeof size === "number") {
    const referenceSize = SIZE_MAP.xxl;
    const referenceOffset = VISUAL_OFFSET_MAP.xxl;

    const calculatedOffset = (size / referenceSize) * referenceOffset;
    return Math.round(calculatedOffset);
  } else {
    return VISUAL_OFFSET_MAP[size] ?? VISUAL_OFFSET_MAP.md;
  }
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, size = "md", nft = true }) => {
  const dimension = resolveSize(size);
  const radius = dimension / 2;

  const visualOffset = resolveOffset(size);

  const frameScale = FRAME_SCALE;
  const frameSize = Math.floor(dimension * frameScale);

  const containerSize = dimension;

  const iconSize = Math.max(16, Math.floor(dimension * 0.56));
  const frameSource: ImageSourcePropType = require("../../assets/images/avatar-frame.png");
  const showImage = Boolean(imageUrl);

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }]}>
      <View style={[styles.inner, { width: dimension, height: dimension, borderRadius: radius }]}>
        {showImage ? (
          <Image source={{ uri: imageUrl as string }} style={{ width: dimension, height: dimension, borderRadius: radius }} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, { width: dimension, height: dimension, borderRadius: radius }]}>
            {TabBarIcons.profile({ focused: false, color: "#FFFFFF", size: iconSize })}
          </View>
        )}
      </View>

      {nft && (
        <Image
          source={frameSource}
          style={[
            styles.frame,
            {
              width: frameSize,
              height: frameSize,
              top: -visualOffset,
              left: -visualOffset,
            },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    backgroundColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    position: "absolute",
  },
});

export default Avatar;
