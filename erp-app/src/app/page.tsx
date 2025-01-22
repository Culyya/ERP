'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import './globals.css';

interface DecodedToken {
  email: string;
  username: string;
  departementId: string;
  roleId: string;
  userId:string;
}

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/Login', { email, password });
      const token = response.data.token;

      
      const decoded: DecodedToken = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('email', decoded.email);
      localStorage.setItem('username', decoded.username);
      localStorage.setItem('departementId', decoded.departementId);
      localStorage.setItem('roleId', decoded.roleId);
      localStorage.setItem('userId', decoded.userId);

      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/dashboard');
      });
      } catch (error: any) {
        Swal.fire({
          title: 'An Error Occurred!',
          text: error.response?.data?.message || 'Incorrect email or password.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="">
          <div className="card-body">
            <div className="text-center">
              <img src="/seatrum-logo.png" alt="Logo" className="w-50 mb-3" />
              <h3 className="mb-4 poppins-reguler" style={{ fontSize: '12px' }}>
                ERP is a software system used by organizations to manage and integrate core business processes such as
                finance, inventory, manufacturing, and human resources in a unified platform.
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="poppins-regular" style={{ fontSize: '12px' }}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-primary poppins-medium"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
