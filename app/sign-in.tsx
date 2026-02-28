import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const setUserName = useAppStore(state => state.setUserName);
    const setUserEmail = useAppStore(state => state.setUserEmail);

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setError('');

        try {
            const savedUserStr = await AsyncStorage.getItem('userData');
            if (!savedUserStr) {
                setError('No account found. Please sign up first.');
                return;
            }

            const savedUser = JSON.parse(savedUserStr);
            if (savedUser.email === email && savedUser.password === password) {
                // Correct credentials
                if (savedUser.fullName) setUserName(savedUser.fullName);
                setUserEmail(savedUser.email);

                // Navigate to home after sign in
                router.replace('/(tabs)');
            } else {
                setError('Invalid email or password');
            }
        } catch (e) {
            console.error('Failed to fetch user data', e);
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="mail" size={20} color="#AA949C" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#AA949C"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="lock" size={20} color="#AA949C" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#AA949C"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#AA949C" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} activeOpacity={0.8}>
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </TouchableOpacity>

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <Link href="/sign-up" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signUpLink}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#AA949C',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCF3F5', // Very faint pink background for input
        borderWidth: 1,
        borderColor: '#F3E9EA',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#150935',
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    signInButton: {
        backgroundColor: '#AD6D71',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    signUpText: {
        color: '#AA949C',
        fontSize: 15,
    },
    signUpLink: {
        color: '#AD6D71',
        fontSize: 15,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
});
