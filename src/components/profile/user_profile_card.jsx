import React from 'react';
import { Card, Avatar, Typography, Box, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  backgroundColor: 'rgba(1, 155, 143, 0.08)', // Very light gray with some transparency
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  border: '.5px solid gray',
  borderRadius: '8px',
  position: 'relative',
  height: '130px',
  overflow: 'hidden',
});

const InfoBox = styled(Box)({
  marginLeft: '16px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // Ensure child text will be truncated
  flexGrow: 1, // Allow InfoBox to take remaining space
});

const BoldText = styled(Typography)({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const LogoutButton = styled(Button)({
  position: 'absolute',
  bottom: '8px',
  right: '8px',
});

const UserProfileCard = ({ imageSrc, email, name, onLogout }) => {
  return (
    <StyledCard>
      <Avatar src={imageSrc} sx={{ width: 56, height: 56 }} />
      <InfoBox>
        <BoldText variant="body1" title={email}>{email}</BoldText>
        <Typography variant="body2">{name}</Typography>
      </InfoBox>
      <LogoutButton onClick={onLogout} aria-label="logout" startIcon={<Logout />}>
        Logout
      </LogoutButton>
    </StyledCard>
  );
};

export default UserProfileCard;
