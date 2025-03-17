"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AppLayout from "@/components/app-layout"
import Modal from "@/components/modal"

export default function NewContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    email: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10,12}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (response.ok) {
        setShowSuccessModal(true)
      } else {
        const data = await response.json()
        setErrors({ submit: data.message || "Failed to create contact" })
      }
    } catch (error) {
      console.error("Error creating contact:", error)
      setErrors({ submit: "An error occurred while creating the contact" })
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push("/contacts")
  }

  return (
    <AppLayout title="Add New Contact">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                  placeholder="0712345678"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-[#1e3a4c] text-white rounded">
                Save Contact
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={showSuccessModal} onClose={handleSuccessModalClose}>
        <div className="text-center">
          <p className="mb-4">Your contact has been saved successfully!</p>
          <button onClick={handleSuccessModalClose} className="px-4 py-2 bg-[#1e3a4c] text-white rounded">
            Okay
          </button>
        </div>
      </Modal>
    </AppLayout>
  )
}

