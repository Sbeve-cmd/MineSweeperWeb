// app/layout.js
import React from 'react'
import '../styles/globals.css'

// root layout component wraps the entire application
export default function RootLayout(props) {
  // render basic html structure with body containing child components
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}
