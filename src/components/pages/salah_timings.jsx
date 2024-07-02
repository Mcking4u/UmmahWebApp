import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';

const SalahTimings = () => {
  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(updateNavState({headerText: "Salah Timings", activeLink:"/salah-timings"}))
  }, [] );

  return <div>SalahTimings Page</div>;
};

export default SalahTimings;