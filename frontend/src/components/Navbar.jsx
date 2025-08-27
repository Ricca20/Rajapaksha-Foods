import React from 'react'

const Navbar = () => {
  return (
    <div>
      <h1>Rajapaksha Foods</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href='/signin'>Sign In</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
