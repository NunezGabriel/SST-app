import React from 'react';

type Props = {
  initials?: string;
  name: string;
  email?: string;
};

export default function ProfileCard({ initials = 'JD', name, email }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-[#003366] flex items-center justify-center text-white text-2xl font-bold shadow-md">
        {initials}
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">{name}</h2>
      {email && <p className="text-sm text-gray-500">{email}</p>}
    </div>
  );
}
