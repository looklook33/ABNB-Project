import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import download from '../../../../images/ABNB-logo.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  let sessionLinks = (
    <>
    <ProfileButton user={sessionUser} />
    </>
  )

  return (
       <div className='nav-header'>
      <div className="nav-container">
        <img className='logo-img' src={download} onClick={() => {
          navigate("/")
        }} />
      </div>
      <div>
        {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;