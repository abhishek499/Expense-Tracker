import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../api/firebase';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '961743678336-e18pnno8jgaqujfbbb1gao0vs9hrj0i4.apps.googleusercontent.com';

type Tab = 'signin' | 'signup';

const LoginScreen = () => {
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (request) {
      console.log("👉 [DEBUG] Your Google Redirect URI is:", request.redirectUri);
      console.log("PLEASE ADD THIS TO YOUR GOOGLE CLOUD CONSOLE 'Authorized Redirect URIs'");
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .catch((e) => Alert.alert('Google Login Error', e.message))
        .finally(() => setLoading(false));
    }
  }, [response]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      return Alert.alert('Missing fields', 'Please enter your email and password.');
    }
    if (tab === 'signup' && password !== confirmPassword) {
      return Alert.alert('Password mismatch', 'Passwords do not match.');
    }

    setLoading(true);
    try {
      if (tab === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      const msg = e.code === 'auth/user-not-found' ? 'No account found with this email.'
        : e.code === 'auth/wrong-password' ? 'Incorrect password.'
        : e.code === 'auth/email-already-in-use' ? 'This email is already registered.'
        : e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : e.message;
      Alert.alert('Authentication Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) return;
    setLoading(true);
    try {
      await promptAsync();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>💰</Text>
          <Text variant="headlineMedium" style={styles.appName}>Expense Tracker</Text>
          <Text variant="bodyMedium" style={styles.tagline}>Take control of your finances</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, tab === 'signin' && styles.tabActive]}
              onPress={() => setTab('signin')}
            >
              <Text style={[styles.tabText, tab === 'signin' && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'signup' && styles.tabActive]}
              onPress={() => setTab('signup')}
            >
              <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            outlineColor="#334155"
            activeOutlineColor="#6366f1"
            textColor="#f1f5f9"
            theme={{ colors: { onSurfaceVariant: '#94a3b8', surface: '#1e293b' } }}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            mode="outlined"
            style={styles.input}
            outlineColor="#334155"
            activeOutlineColor="#6366f1"
            textColor="#f1f5f9"
            theme={{ colors: { onSurfaceVariant: '#94a3b8', surface: '#1e293b' } }}
            right={
              <TextInput.Icon
                icon={showPass ? 'eye-off' : 'eye'}
                color="#64748b"
                onPress={() => setShowPass(!showPass)}
              />
            }
          />

          {/* Confirm Password (Sign Up only) */}
          {tab === 'signup' && (
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPass}
              mode="outlined"
              style={styles.input}
              outlineColor="#334155"
              activeOutlineColor="#6366f1"
              textColor="#f1f5f9"
              theme={{ colors: { onSurfaceVariant: '#94a3b8', surface: '#1e293b' } }}
            />
          )}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.disabled]}
            onPress={handleEmailAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size={20} color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={[styles.googleBtn, (!request || loading) && styles.disabled]}
            onPress={handleGoogleLogin}
            disabled={!request || loading}
            activeOpacity={0.85}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  blob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#6366f130',
    top: -100,
    left: -100,
  },
  blob2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#f43f5e1a',
    bottom: -80,
    right: -80,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 10,
  },
  appName: {
    color: '#f1f5f9',
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  tagline: {
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 28,
    padding: 24,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#1e293b',
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    marginHorizontal: 12,
    fontSize: 13,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});

export default LoginScreen;
