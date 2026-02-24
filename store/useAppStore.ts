import { create } from 'zustand';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: any;
    description?: string;
    categories: string[];
}

const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Pink Roses Bouquet',
        price: '$45',
        image: require('../assets/images/image.png'),
        description: 'A beautiful bouquet of fresh pink roses, perfect for expressing admiration and joy.',
        categories: ['Roses', 'Bouquets', 'Anniversary']
    },
    {
        id: '2',
        name: 'Lavender Dreams',
        price: '$38',
        image: require('../assets/images/image.png'),
        description: 'Calming lavender arrangements that bring a sense of peace and tranquility.',
        categories: ['Bouquets']
    },
    {
        id: '3',
        name: 'White Tulips',
        price: '$42',
        image: require('../assets/images/image.png'),
        description: 'Elegant white tulips symbolizing purity and forgiveness, ideal for new beginnings.',
        categories: ['Bouquets']
    },
    {
        id: '4',
        name: 'Sunflower Joy',
        price: '$35',
        image: require('../assets/images/image.png'),
        description: 'Bright and cheerful sunflowers guaranteed to bring a smile to anyone\'s face.',
        categories: ['Birthday']
    },
    {
        id: '5',
        name: 'Red Velvet Roses',
        price: '$50',
        image: require('../assets/images/image.png'),
        description: 'Classic deep red roses, the ultimate symbol of romantic love and passion.',
        categories: ['Roses', 'Anniversary']
    },
    {
        id: '6',
        name: 'Blush Hydrangeas',
        price: '$40',
        image: require('../assets/images/image.png'),
        description: 'Voluminous blush pink hydrangeas representing heartfelt emotions and gratitude.',
        categories: ['Birthday', 'Bouquets']
    },
    {
        id: '7',
        name: 'Vibrant Orchids',
        price: '$65',
        image: require('../assets/images/image.png'),
        description: 'Exotic and vibrant orchids that bring a touch of tropical elegance.',
        categories: ['Anniversary']
    },
    {
        id: '8',
        name: 'Pastel Peonies',
        price: '$55',
        image: require('../assets/images/image.png'),
        description: 'Delicate pastel peonies, perfect for expressing compassion and good fortune.',
        categories: ['Bouquets', 'Roses']
    },
    {
        id: '9',
        name: 'Sunny Daisies',
        price: '$30',
        image: require('../assets/images/image.png'),
        description: 'A cheerful bunch of daisies to brighten up any room instantly.',
        categories: ['Birthday']
    },
    {
        id: '10',
        name: 'Magnificent Lilies',
        price: '$48',
        image: require('../assets/images/image.png'),
        description: 'Striking lilies that make a bold statement, representing rebirth and purity.',
        categories: ['Bouquets', 'Anniversary']
    }
];

export interface CartItem extends Product {
    quantity: number;
}

export interface Address {
    id: string;
    title: string;
    address: string;
    isDefault: boolean;
    type: string;
}

interface AppState {
    userName: string;
    userEmail: string;
    favorites: string[]; // Store only the IDs of favorite products
    products: Product[];
    cart: CartItem[];
    addresses: Address[];
    setUserName: (name: string) => void;
    setUserEmail: (email: string) => void;
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (id: string) => void;
    updateCartQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    addAddress: (address: Address) => void;
    updateAddress: (id: string, updatedAddress: Partial<Address>) => void;
    deleteAddress: (id: string) => void;
    isDarkMode: boolean;
    toggleDarkMode: (value: boolean) => void;
}

const INITIAL_ADDRESSES: Address[] = [
    {
        id: '1',
        title: 'Home',
        address: '123 Flower Street, Bloomingdale, NY 10001',
        isDefault: true,
        type: 'home',
    },
    {
        id: '2',
        title: 'Office',
        address: '456 Tech Avenue, Future City, NY 10002',
        isDefault: false,
        type: 'briefcase',
    }
];

export const useAppStore = create<AppState>((set, get) => ({
    userName: 'Guest',
    userEmail: 'guest@bloomy.com',
    favorites: [],
    products: PRODUCTS,
    cart: [],
    addresses: INITIAL_ADDRESSES,
    isDarkMode: false,

    setUserName: (name: string) => set({ userName: name }),
    setUserEmail: (email: string) => set({ userEmail: email }),

    toggleFavorite: (id: string) => set((state) => {
        const isCurrentlyFavorite = state.favorites.includes(id);
        if (isCurrentlyFavorite) {
            return { favorites: state.favorites.filter(favId => favId !== id) };
        } else {
            return { favorites: [...state.favorites, id] };
        }
    }),

    isFavorite: (id: string) => {
        return get().favorites.includes(id);
    },

    addToCart: (product: Product, quantity: number) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                )
            };
        }
        return { cart: [...state.cart, { ...product, quantity }] };
    }),

    removeFromCart: (id: string) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
    })),

    updateCartQuantity: (id: string, delta: number) => set((state) => ({
        cart: state.cart.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        })
    })),

    clearCart: () => set({ cart: [] }),

    addAddress: (address: Address) => set((state) => ({
        addresses: [...state.addresses, address]
    })),

    updateAddress: (id: string, updatedAddress: Partial<Address>) => set((state) => ({
        addresses: state.addresses.map(addr => addr.id === id ? { ...addr, ...updatedAddress } : addr)
    })),

    deleteAddress: (id: string) => set((state) => ({
        addresses: state.addresses.filter(addr => addr.id !== id)
    })),

    toggleDarkMode: (value: boolean) => set({ isDarkMode: value })
}));
