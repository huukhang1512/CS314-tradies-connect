import React, { useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { GiRoundStar } from "react-icons/gi";

export type RatingProps = {
  size?: number;
  onChange: (rating: number) => void;
  value: number;
  maxRating: number;
  name: string
}

const Rating = ({ size, onChange, value, maxRating }: RatingProps) => {
  const [rating, setRating] = useState(value);

  const onClick = (idx) => {
    if (!isNaN(idx)) {
      setRating(idx);
      onChange(idx)
    }
  };

  const RatingIcon = ({ fill }) => {
    return (
      <GiRoundStar
        size={"3em"}
        color={fill ? "#FFDB5E" : "#D8DAE2"}
        onClick={onClick}
      />
    );
  };

  const RatingButton = ({ idx, fill }) => {
    return (
      <Box
        as="button"
        aria-label={`Rate ${idx}`}
        height={`${size}px`}
        width={`${size}px`}
        mx={1}
        onClick={() => onClick(idx)}
        _focus={{ outline: 0 }}
      >
        <RatingIcon fill={fill} />
      </Box>
    );
  };

  return (
    <Stack isInline mt={3} justify="center">
      {[...Array(maxRating)].map((_, i) => (
        <RatingButton key={i + 1} idx={i + 1} fill={i < rating} />
      ))}
    </Stack>
  );
};

export default Rating;
