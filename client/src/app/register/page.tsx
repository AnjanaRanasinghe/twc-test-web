"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../components/auth-provider"
import AuthLayout from "../../components/auth-layout"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const success = await register(email, password)
    if (success) {
      router.push("/login")
    } else {
      setError("Registration failed. Email may already be in use.")
    }
  }

  return (
    <AuthLayout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Register Now!</h1>

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
              placeholder="create password"
              className="w-full p-3 rounded-full text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="confirm password"
              className="w-full p-3 rounded-full text-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="px-8 py-2 rounded-full border border-white text-white">
              register
            </button>
          </div>
        </form>

        <div className="mt-6">
          <Link href="/login" className="text-white underline">
            &lt; Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

