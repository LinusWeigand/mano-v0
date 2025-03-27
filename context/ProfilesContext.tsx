"use client";
import { ProfileModel } from '@/types/ProfileModel';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfilesContextProps {
  setProfiles: React.Dispatch<React.SetStateAction<ProfileModel[]>>;
  profiles: ProfileModel[]
}

const ProfilesContext = createContext<ProfilesContextProps | undefined>(undefined);

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfilesProvider');
  }
  return context;
};

export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<ProfileModel[]>([]);

  return (
    <ProfilesContext.Provider value={{ profiles, setProfiles }}>
      {children}
    </ProfilesContext.Provider>
  );
};
