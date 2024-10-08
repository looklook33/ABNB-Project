import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  // if user exist, display use information otherwise display login and sign up
  return (
    <div className='profile-wrapper'>
      <div className='profile_container'>
        {user && <div id='create_link' className='button-22' style={{ color: 'white' }}>
          <Link to={'/spots/new'}>Create a New Spot</Link></div>}
        <button className='dropdown-toggle' onClick={toggleMenu}>
          <FaUserCircle />
        </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='dropdown-menu-login'>
            <>
              <li style={{ listStyle: 'none' }}>Hello, {user.firstName}</li>
              <li style={{ listStyle: 'none' }}>{user.email}</li>
              <hr></hr>
              <div >
              <li style={{ listStyle: 'none' }} ><Link to={'/spots/current'}
              style={{ textDecoration: 'none' }} 
              >Manage Spots</Link></li>
              </div>
              <hr></hr>
              <li className='log-out-button' style={{ listStyle: 'none' }}>
                <button className='button-22'
                  onClick={logout}>Log Out</button>
              </li>

            </>
          </div>

        ) : (
          <div className='dropdown-menu'>
            <OpenModalMenuItem
              itemText=" Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />

            <OpenModalMenuItem
              itemText=" Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;