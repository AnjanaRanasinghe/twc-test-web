"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../components/auth-provider"
import AuthLayout from "../../components/auth-layout"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  return (
    <AuthLayout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-2">Hi there,</h1>
        <p className="text-xl mb-8">Welcome to our contacts portal</p>

        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="e-mail"
              className="w-full p-3 rounded-full text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              className="w-full p-3 rounded-full text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <button type="submit" className="px-8 py-2 rounded-full border border-white text-white">
              login
            </button>
            <span className="ml-4 text-white">or</span>
            <Link href="/register" className="ml-4 underline">
              Click here to Register
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

