import React, { useEffect } from 'react';
import {logout} from "../../../../actions/authentication";


const LogoutPage = () => {
  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      window.location.href = '/pages/login';
    };
    handleLogout();
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
      {/* You can add a loading spinner or other UI elements here */}
    </div>
  );
};

export default LogoutPage;


