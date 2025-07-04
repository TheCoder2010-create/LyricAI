"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from './use-toast';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
        // onAuthStateChanged will set loading to false
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
      });
    } finally {
        // onAuthStateChanged will set loading to false
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
