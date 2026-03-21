"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ZestCard, ZestCardHeader, ZestCardTitle, ZestCardContent } from "@/components/ui/ZestCard";
import { ZestButton } from "@/components/ui/ZestButton";
import { ZestAvatar } from "@/components/ui/ZestAvatar";

type ProfileForm = {
  businessOwner: string;
  businessName: string;
  contactNumber: string;
  email: string;
  country: string;
  state: string;
  city: string;
};

const emptyProfile: ProfileForm = {
  businessOwner: "",
  businessName: "",
  contactNumber: "",
  email: "",
  country: "",
  state: "",
  city: "",
};

export function ProfileSettings() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setProfileMessage("");

      if (!user) {
        setUid(null);
        setProfile(emptyProfile);
        setLoadingProfile(false);
        return;
      }

      setUid(user.uid);
      setLoadingProfile(true);

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        setProfile({
          businessOwner: userData?.businessOwner ?? user.displayName ?? "",
          businessName: userData?.businessName ?? "",
          contactNumber: userData?.contactNumber ?? "",
          email: userData?.email ?? user.email ?? "",
          country: userData?.address?.country ?? "",
          state: userData?.address?.state ?? "",
          city: userData?.address?.city ?? "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfileMessage("Unable to load profile information right now.");
      } finally {
        setLoadingProfile(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");

    if (!uid) {
      setProfileMessage("You need to be signed in to update your profile.");
      return;
    }

    setSavingProfile(true);

    try {
      await updateDoc(doc(db, "users", uid), {
        businessOwner: profile.businessOwner.trim(),
        businessName: profile.businessName.trim(),
        contactNumber: profile.contactNumber.trim(),
        email: profile.email.trim(),
        address: {
          country: profile.country.trim(),
          state: profile.state.trim(),
          city: profile.city.trim(),
        },
      });

      setProfile((current) => ({
        ...current,
        businessOwner: current.businessOwner.trim(),
        businessName: current.businessName.trim(),
        contactNumber: current.contactNumber.trim(),
        email: current.email.trim(),
        country: current.country.trim(),
        state: current.state.trim(),
        city: current.city.trim(),
      }));
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setProfileMessage("Unable to update profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    const user = auth.currentUser;

    if (!user || !user.email) {
      setPasswordMessage("You need to be signed in to change your password.");
      return;
    }

    if (password.new.length < 8) {
      setPasswordMessage("New password must be at least 8 characters long.");
      return;
    }

    if (password.new !== password.confirm) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, password.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password.new);

      setPassword({
        current: "",
        new: "",
        confirm: "",
      });
      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordMessage("Unable to change password. Please verify your current password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const avatarFallback = ( profile.businessName || profile.businessOwner ||  "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8">
      <ZestCard>
        <ZestCardHeader>
          <ZestCardTitle>Profile Information</ZestCardTitle>
        </ZestCardHeader>
        <ZestCardContent>
          {loadingProfile ? (
            <p className="text-sm text-slate-500">Loading profile information...</p>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-4">
                <ZestAvatar fallback={avatarFallback || "U"} size="lg" />
                <div>
                  <ZestButton type="button" variant="outline">Change Picture</ZestButton>
                  <p className="mt-1 text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              {profileMessage && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {profileMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Business Owner</label>
                  <input
                    value={profile.businessOwner}
                    onChange={(e) => setProfile((current) => ({ ...current, businessOwner: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Business Name</label>
                  <input
                    value={profile.businessName}
                    onChange={(e) => setProfile((current) => ({ ...current, businessName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Contact Number</label>
                  <input
                    value={profile.contactNumber}
                    onChange={(e) => setProfile((current) => ({ ...current, contactNumber: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((current) => ({ ...current, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Country</label>
                  <input
                    value={profile.country}
                    onChange={(e) => setProfile((current) => ({ ...current, country: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                  <input
                    value={profile.state}
                    onChange={(e) => setProfile((current) => ({ ...current, state: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfile((current) => ({ ...current, city: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <ZestButton type="submit" isLoading={savingProfile}>
                  Update Profile
                </ZestButton>
              </div>
            </form>
          )}
        </ZestCardContent>
      </ZestCard>

      <ZestCard>
        <ZestCardHeader>
          <ZestCardTitle>Change Password</ZestCardTitle>
        </ZestCardHeader>
        <ZestCardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordMessage && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {passwordMessage}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => setPassword((current) => ({ ...current, current: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword((current) => ({ ...current, new: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword((current) => ({ ...current, confirm: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              />
            </div>
            <div className="flex justify-end">
              <ZestButton type="submit" isLoading={changingPassword}>
                Change Password
              </ZestButton>
            </div>
          </form>
        </ZestCardContent>
      </ZestCard>
    </div>
  );
}
