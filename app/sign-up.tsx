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

const signUpSchema = z.object({
    fullName: z.string().min(1, 'Please fill in all fields'),
    email: z.string().min(1, 'Please fill in all fields').refine(val => val.toLowerCase().includes('@gmail'), 'Email must be a @gmail address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
    const router = useRouter();
    const setUserName = useAppStore(state => state.setUserName);
    const setUserEmail = useAppStore(state => state.setUserEmail);
    const [showPassword, setShowPassword] = useState(false);
    const { colors } = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            const userData = { fullName: data.fullName, email: data.email, password: data.password };
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (e) {
            console.error('Failed to save user data', e);
        }

        if (data.fullName) {
            setUserName(data.fullName);
        }
        if (data.email) {
            setUserEmail(data.email);
        }
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.icon }]}>Sign up to start shopping</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                            <Controller
                                control={control}
                                name="fullName"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                                        <Feather name="user" size={20} color={colors.icon} style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, { color: colors.text }]}
                                            placeholder="Your name"
                                            placeholderTextColor={colors.icon}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                )}
                            />
                            {errors.fullName && <Text style={[styles.errorText, { color: colors.error }]}>{errors.fullName.message}</Text>}
                        </View>

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

                        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: colors.primary }]} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
                            <Text style={[styles.signUpButtonText, { color: colors.buttonText }]}>Create Account</Text>
                        </TouchableOpacity>

                        <View style={styles.signInContainer}>
                            <Text style={[styles.signInText, { color: colors.icon }]}>Already have an account? </Text>
                            <Link href="/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
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
    signUpButton: {
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    signUpButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    signInText: {
        fontSize: 15,
    },
    signInLink: {
        fontSize: 15,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
