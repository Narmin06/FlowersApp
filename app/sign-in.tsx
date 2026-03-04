import useTheme from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().min(1, 'Please fill in all fields').refine(val => val.toLowerCase().includes('@gmail'), 'Email must be a @gmail address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { colors } = useTheme();

    const setUserName = useAppStore(state => state.setUserName);
    const setUserEmail = useAppStore(state => state.setUserEmail);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignInFormValues) => {
        setSubmitError('');

        try {
            const savedUserStr = await AsyncStorage.getItem('userData');
            if (!savedUserStr) {
                setSubmitError('No account found. Please sign up first.');
                return;
            }

            const savedUser = JSON.parse(savedUserStr);
            if (savedUser.email === data.email && savedUser.password === data.password) {
                if (savedUser.fullName) setUserName(savedUser.fullName);
                setUserEmail(savedUser.email);

                router.replace('/(tabs)');
            } else {
                setSubmitError('Invalid email or password');
            }
        } catch (e) {
            console.error('Failed to fetch user data', e);
            setSubmitError('Something went wrong. Try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.icon }]}>Sign in to continue shopping</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                                        <Feather name="mail" size={20} color={colors.icon} style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, { color: colors.text }]}
                                            placeholder="your@email.com"
                                            placeholderTextColor={colors.icon}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                )}
                            />
                            {errors.email && <Text style={[styles.errorText, { color: colors.error }]}>{errors.email.message}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                                        <Feather name="lock" size={20} color={colors.icon} style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, { color: colors.text }]}
                                            placeholder="••••••••"
                                            placeholderTextColor={colors.icon}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={colors.icon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            {errors.password && <Text style={[styles.errorText, { color: colors.error }]}>{errors.password.message}</Text>}
                        </View>

                        {submitError ? <Text style={[styles.submitErrorText, { color: colors.error }]}>{submitError}</Text> : null}

                        <TouchableOpacity style={[styles.signInButton, { backgroundColor: colors.primary }]} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
                            <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>Sign In</Text>
                        </TouchableOpacity>

                        <View style={styles.signUpContainer}>
                            <Text style={[styles.signUpText, { color: colors.icon }]}>Don't have an account? </Text>
                            <Link href="/sign-up" asChild>
                                <TouchableOpacity>
                                    <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
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
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
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
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    signInButton: {
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signInButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    signUpText: {
        fontSize: 15,
    },
    signUpLink: {
        fontSize: 15,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    submitErrorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
});
