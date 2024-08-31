import { useState, useEffect} from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errors = {};
    // Validate credential length
    if (credential.length < 4) {
      errors.credential = "";
    }
    // Validate password length
    if (password.length < 6) {
      errors.password = "";
    }
  
    setErrors(errors);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({ message: "The provided credentials were invalid" });
        }
      });
  };

  const handleDemoLogin = () => {
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
  }

  return (
    <div>
      <h1>Log In</h1>
      {errors.message && (
          <p style={{ color: 'rgb(196, 75, 75)' }}>{errors.message}</p>
        )}
      {errors.credential && <p style={{ color: "blue" }}>{errors.credential}</p>}
      <form className='user-form' onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) =>
              setCredential(e.target.value)}
            required
          />
        </label>
        {errors.password && <p style={{ color: "blue" }}>{errors.password}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className='button-22'
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >Log In</button>
      </form>

      <button className='demo-button'
       onClick={handleDemoLogin}>Log in as Demo User</button>
    </div>
  );
}

export default LoginFormModal;