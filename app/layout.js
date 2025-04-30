// app/layout.js
import React from 'react'
import '../styles/globals.css'

export default function RootLayout(props) {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}
