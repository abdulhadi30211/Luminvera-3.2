import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // ✅ Pass current URL to exchangeCodeForSession
        const url = window.location.href;
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession({ url });
        if (authError) throw authError;

        const user = data.session?.user;
        if (!user) throw new Error('No active user session');

        // ✅ Check if user profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // ✅ If no profile, insert a new one
        if (!existingProfile && profileError && profileError.code === 'PGRST116') {
          const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';

          const { error: insertError } = await supabase.from('profiles').insert([
            {
              id: user.id,
              username: username,
              full_name: user.user_metadata?.full_name || username,
              role: 'user',
            },
          ]);

          if (insertError) console.error('Error inserting profile:', insertError);
        }

        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-800">Verifying your email...</h2>
          <p className="text-sm text-gray-500">Please wait while we confirm your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
          <p className="text-sm text-gray-600 my-2">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg mt-4 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Email Verified!</h2>
          <p className="text-sm text-gray-600 my-2">You're all set. Redirecting you to the homepage...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
