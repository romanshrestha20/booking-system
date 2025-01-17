import React from 'react'

const UserProfile = () => {
    const { user } = useAuth();
    
  return (
      <div>
        <h1>User Profile</h1>
        <p>Update your profile here</p>
    </div>
  )
}

export default UserProfile