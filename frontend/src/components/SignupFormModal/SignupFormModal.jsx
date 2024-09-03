import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errs = {};
    if (username.length < 4) errs.username = " ";
    if (password.length < 6) errs.password = " ";
    setErrors(errs);
  }, [username, password])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>

      {errors.email && <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.email}</p>}
      {errors.username && <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.username}</p>}
      {errors.confirmPassword && (
        <p style={{ color: 'rgb(196, 75, 75)' }} className='user-form'>{errors.confirmPassword}</p>
      )}

      <form onSubmit={handleSubmit} className='user-form'>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button className='button-22 ' type="submit"
          disabled={(!email || password.length < 6 || confirmPassword.length < 1 || username.length < 4 || firstName.length < 1 || lastName.length < 1)}
        >Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;