import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { Animated, PanResponder, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
    extrapolate: "extend",
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 200,
    restDisplacementThreshold: 200,
  });

  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 200,
    restDisplacementThreshold: 200,
  });
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };

  const checkPress = () => {
    goRight.start(onDismiss);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -150) {
          goLeft.start(onDismiss);
        } else if (dx > 150) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }

        //position.flattenOffset();
      },
      onPanResponderGrant: () => {
        //position.setOffset(position._value);
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
    })
  ).current;

  return (
    <Container>
      <CardContainer>
        <AnimatedCard style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
        </AnimatedCard>
        <AnimatedCard
          style={{
            transform: [
              { translateX: position },
              { scale },
              { rotateZ: rotation },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <Ionicons name={icons[index]} color="#192a56" size={98} />
        </AnimatedCard>
      </CardContainer>

      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" color="red" size={58} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="green" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const AnimatedCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;
