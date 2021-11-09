import React, { useRef } from "react";
import styled from "styled-components/native";
import { Animated, PanResponder } from "react-native";

export default function App() {
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) =>
        POSITION.setValue({ x: dx, y: dy }),
      onPanResponderGrant: () => {
        POSITION.setOffset({ x: POSITION.x._value, y: POSITION.y._value });
      },
      onPanResponderRelease: () => {
        POSITION.flattenOffset();
      },
    })
  ).current;

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
  });

  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
        style={{
          transform: POSITION.getTranslateTransform(),
          borderRadius,
          backgroundColor: bgColor,
        }}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);
