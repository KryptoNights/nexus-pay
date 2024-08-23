import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout/Layout';
import Image from 'next/image';
import Head from 'next/head';

const Profile = () => {
  const { nexusId } = useSelector((state) => state.authSlice);
  const [customNexusId, setCustomNexusId] = useState('');
  const { idToken, activeAccount } = useSelector(
    (state) => state.authSlice
  );

  const handleCustomNexusIdPurchase = async () => {
    console.log(`Attempting to purchase custom Nexus ID: ${customNexusId}`);
  };

  const handleProfilePhotoChange = (event) => {
    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     // setProfilePhoto(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  return (
    <Layout>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Your Profile</h1>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary">
              {idToken?.state?.accounts[0]?.idToken?.decoded
                ?.picture ? (
                <Image
                  src={
                    idToken?.state?.accounts[0]?.idToken?.decoded
                      ?.picture ?? ""
                  }
                  width={2400}
                  height={2400}
                  alt="profile"
                  className="rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <label className="btn btn-outline btn-primary btn-sm">
              Upload Photo
              <input type="file" onChange={handleProfilePhotoChange} accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="space-y-4">
            <InfoField label="Wallet Address" value={activeAccount || 'Not connected'} />
            <InfoField label="Email" value={idToken?.state?.accounts[0]?.idToken?.decoded
              ?.email || 'Not provided'} />
            <InfoField label="Nexus ID" value={nexusId || 'Not set'} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Purchase Custom Nexus ID</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customNexusId}
              onChange={(e) => setCustomNexusId(e.target.value)}
              placeholder="Enter desired Nexus ID"
              className="input input-bordered input-primary flex-grow"
            />
            <button
              onClick={handleCustomNexusIdPurchase}
              className="btn btn-primary"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-400">{label}</h3>
    <p className="text-lg font-semibold text-white bg-gray-700 p-2 rounded mt-1 break-all">{value}</p>
  </div>
);

export default Profile;