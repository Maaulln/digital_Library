"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Shield, AlertCircle, CheckCircle, ChevronRight } from "lucide-react"
import MemberNavbar from "@/components/member-navbar"
import AdminNavbar from "@/components/admin-navbar"

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Form states
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updateMessage, setUpdateMessage] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [updating, setUpdating] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
        setName(data.name)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateMessage("")
    setUpdating(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile({ ...profile!, name })
      setUpdateMessage("Profile updated successfully")
    } catch (err: any) {
      setUpdateMessage(`Error: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage("")

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match")
      return
    }

    setChangingPassword(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to change password")
      }

      setPasswordMessage("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPasswordMessage(`Error: ${err.message}`)
    } finally {
      setChangingPassword(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error || "Failed to load profile"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {profile.role === "admin" ? <AdminNavbar /> : <MemberNavbar />}
      <div className="bg-emerald-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Account Settings</h1>
                <p className="text-emerald-100">Manage your profile and security preferences</p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-emerald-100 bg-emerald-700/50 px-4 py-2 rounded-full">
                Member since {formatDate(profile.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <div className="bg-white rounded-t-xl shadow-sm p-1">
              <TabsList className="grid grid-cols-2 gap-1 bg-gray-100/80 rounded-lg p-1">
                <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 bg-gray-50/50">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full">
                          {profile.role}
                        </span>
                      </div>
                      <Separator className="bg-gray-200" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Verified</span>
                      </div>
                      <Separator className="bg-gray-200" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Account ID</p>
                        <span className="text-xs text-gray-500">#{profile.id}</span>
                      </div>
                      <Separator className="bg-gray-200" />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <TabsContent value="general" className="p-0 mt-0">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-6">Personal Information</h3>
                      
                      <form onSubmit={handleUpdateProfile} className="max-w-md">
                        <div className="space-y-5">
                          <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-sm font-medium">
                              Full Name
                            </Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              className="h-11 ring-offset-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          
                          <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email Address
                            </Label>
                            <Input 
                              id="email" 
                              value={profile.email} 
                              disabled 
                              className="h-11 bg-gray-50 cursor-not-allowed" 
                            />
                            <p className="text-xs text-gray-500">Email address cannot be changed</p>
                          </div>
                        </div>
                        
                        {updateMessage && (
                          <div className={`mt-6 p-3 rounded-lg flex items-center ${
                            updateMessage.includes("Error") 
                              ? "bg-red-50" 
                              : "bg-emerald-50"
                          }`}>
                            {updateMessage.includes("Error") ? (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${updateMessage.includes("Error") ? "text-red-500" : "text-emerald-700"}`}>
                              {updateMessage}
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-8">
                          <Button 
                            type="submit" 
                            className="bg-emerald-500 hover:bg-emerald-600 rounded-lg h-11 px-5 text-white shadow-sm"
                            disabled={updating}
                          >
                            {updating ? "Updating..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="p-0 mt-0">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-6">Password Settings</h3>
                      
                      <form onSubmit={handleChangePassword} className="max-w-md">
                        <div className="space-y-5">
                          <div className="space-y-2.5">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                              Current Password
                            </Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                              className="h-11 ring-offset-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          
                          <div className="space-y-2.5">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                              New Password
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              className="h-11 ring-offset-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          
                          <div className="space-y-2.5">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="h-11 ring-offset-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                        
                        {passwordMessage && (
                          <div className={`mt-6 p-3 rounded-lg flex items-center ${
                            passwordMessage.includes("Error") 
                              ? "bg-red-50" 
                              : "bg-emerald-50"
                          }`}>
                            {passwordMessage.includes("Error") ? (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${passwordMessage.includes("Error") ? "text-red-500" : "text-emerald-700"}`}>
                              {passwordMessage}
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-8">
                          <Button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-600 rounded-lg h-11 px-5 text-white shadow-sm"
                            disabled={changingPassword}
                          >
                            {changingPassword ? "Processing..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Your personal information is protected and only visible to system administrators.
                </p>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}