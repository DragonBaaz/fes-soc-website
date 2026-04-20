"use client"

import React from "react"

interface CharacterFadeInProps {
  text: string
  className?: string
  duration?: number // in milliseconds
}

export function CharacterFadeIn({ 
  text, 
  className = "", 
  duration = 3500 // ~one breath cycle
}: CharacterFadeInProps) {
  const characters = text.split("")
  const delayPerChar = duration / characters.length

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <span
          key={index}
          className="inline-block animate-char-fade-in"
          style={{
            animationDelay: `${index * delayPerChar}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
