import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

const slideFadeKeyframes = keyframes`
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const SlideTransition = ({ children }) => {
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setInProp(true);
  }, []);

  return (
    <Box
      sx={{
        animation: `${slideFadeKeyframes} 700ms ease-in-out`,
        opacity: inProp ? 1 : 0,
        transform: inProp ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {children}
    </Box>
  );
};

export default SlideTransition;