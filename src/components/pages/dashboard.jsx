import SlideTransition from "../animation/slide_transition";
import withNavUpdate from "../wrappers/with_nav_update";

const Dashboard = (props) => {
  return <div>DASHBOARD</div>;
};

export default withNavUpdate(SlideTransition(Dashboard));
