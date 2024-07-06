import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(
      updateNavState({
        headerText: "Dashboard",
        activeLink: "/masjid/",
      })
    )
  }, [] )

  return (  <div>DASHBOARD</div>);
}
 
export default Dashboard;