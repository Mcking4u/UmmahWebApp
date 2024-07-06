import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNavState } from '../../redux/navSlice';
const withNavUpdate = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateNavState({
      headerText: props.label,
      activeLink: props.route,
    }));
  }, [dispatch, props.label, props.route]);

  return <WrappedComponent {...props} />;
};

export default withNavUpdate;