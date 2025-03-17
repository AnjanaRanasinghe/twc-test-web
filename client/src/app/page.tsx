"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AppLayout from "../components/app-layout"
import { useAuth } from "../components/auth-provider"

export default function WelcomePage() {
  const { user } = useAuth()
  const [hasContacts, setHasContacts] = useState(false)

  useEffect(() => {
    const checkContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/contacts", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setHasContacts(data.length > 0)
        }
      } catch (error) {
        console.error("Failed to check contacts:", error)
      }
    }

    if (user) {
      checkContacts()
    }
  }, [user])

  return (
    <AppLayout title="Welcome">
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome.</h1>
          <p className="text-xl mb-8">
            This is where your contacts will live. Click the button below to add a new contact.
          </p>

          <Link href="/contacts/new" className="inline-block px-8 py-2 rounded-full border border-white text-white">
            add your first contact
          </Link>

          {hasContacts && (
            <div className="mt-4">
              <Link href="/contacts" className="text-white underline">
                View your contacts
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

