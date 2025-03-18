'use client'

import { UserButton } from '@clerk/nextjs'
import UnSafePage from '../dob/dobPrompt'
import { useState } from 'react'


const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

export const CustomUserButton = () => {
  const [birthday, setBirthday] = useState('');
  return (
    <UserButton>
      <UserButton.UserProfilePage label="Birthday" url="custom" labelIcon={<DotIcon />}>
        <div>
          <p>{birthday}</p>
        </div>
        <div>
          <UnSafePage onBirthdayUpdate = {setBirthday} />
        </div>
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
    </UserButton>
  )
};
