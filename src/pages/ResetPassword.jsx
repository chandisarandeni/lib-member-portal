import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from 'react-hot-toast';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {getMemberByEmail, editMember} = useContext(AppContext);

  const fetchMemberData = useCallback(async (emailAddress) => {
    try {
      setLoading(true);
      const response = await getMemberByEmail(emailAddress);
      console.log('Raw API response:', response);
      
      // Handle if response is an array - find the specific member
      let member = null;
      if (Array.isArray(response)) {
        member = response.find(m => m.email === emailAddress);
        console.log('Found member from array:', member);
      } else {
        member = response;
        console.log('Single member response:', member);
      }
      
      if (member) {
        setMemberData(member);
        console.log('Member data set:', member);
      } else {
        toast.error('Member not found with this email address');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast.error('Error fetching member data');
    } finally {
      setLoading(false);
    }
  }, [getMemberByEmail]);

  useEffect(() => {
    // Get email and otpCode from URL parameters
    const emailParam = searchParams.get('email');
    const otpParam = searchParams.get('otpCode');
    
    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtpCode(otpParam);
    
    console.log('Reset password parameters:', { email: emailParam, otpCode: otpParam });
    
    // Fetch member data when email is available
    if (emailParam) {
      fetchMemberData(emailParam);
    }
  }, [searchParams, fetchMemberData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!memberData) {
      toast.error("Member data not found. Please try again.");
      return;
    }

    if (!otpCode) {
      toast.error("OTP code is required for password reset.");
      return;
    }

    try {
      setLoading(true);
      
      // Get member ID from the fetched data
      const memberId = memberData.id || memberData.memberId || memberData.member_id;
      
      if (!memberId) {
        toast.error("Member ID not found. Please contact support.");
        return;
      }

      // Prepare updated data - keep all existing fields, only update password
      const updatedData = {
        ...memberData, // Keep all existing member data
        password: password, // Update only the password
        // Include OTP for verification if your backend requires it
        otpCode: otpCode
      };

      console.log('Updating member with data:', {
        memberId,
        updatedData: { ...updatedData, password: '[HIDDEN]' } // Hide password in logs
      });

      // Call editMember with member ID and updated data
      const result = await editMember(memberId, updatedData);
      
      if (result) {
        toast.success('Password reset successfully!', {
          duration: 4000,
          position: 'top-center',
        });
        
        // Optional: Redirect to login page after successful reset
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-courier">
      {/* Left Side */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-white p-12 border-r border-gray-200">
        <img
          src="/sarasavi-logo-black.png"
          alt="Logo"
          className="w-[280px] mb-0 pt-0"
        />
        <h1 className="text-[35px] font-extrabold text-gray-800 mb-3">
          Sarasavi Library
        </h1>
        <p className="text-gray-600 text-center max-w-xs leading-relaxed">
          To create an accessible library management system that connects
          readers with books effortlessly.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Reset Password
          </h2>
          {email && (
            <p className="text-center text-gray-600 mb-4">
              Resetting password for: <span className="font-semibold">{email}</span>
            </p>
          )}
          {memberData && (
            <p className="text-center text-gray-500 text-sm mb-4">
              Member: {memberData.name || 'Unknown'}
            </p>
          )}
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !memberData}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-6">
            <p>
              Remember your password?
              <Link to="/" className="text-blue-600 hover:underline ml-2">
                Go back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;