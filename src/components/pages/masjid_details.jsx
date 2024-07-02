import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';

const MasjidDetails = () => {
  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(updateNavState({headerText: "Masjid Details", activeLink:"/details"}))
  }, [] );

  return <div>Masjid Details Page</div>;
};

export default MasjidDetails;