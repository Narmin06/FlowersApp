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
        name: 'Pink Roses',
        price: '60 AZN',
        image: require('../assets/images/pink_roses.jpg'),
        description: 'A beautiful bouquet of fresh pink roses, perfect for expressing admiration and joy.',
        categories: ['Roses', 'Bouquets']
    },
    {
        id: '2',
        name: 'Yellow Roses',
        price: '70 AZN',
        image: require('../assets/images/yellow_rose.jpg'),
        description: 'Bright and joyful yellow roses, arranged beautifully.',
        categories: ['Roses', 'Bouquets']
    },
    {
        id: '3',
        name: 'White Tulips',
        price: '50 AZN',
        image: require('../assets/images/white_tulips.jpg'),
        description: 'Elegant white tulips symbolizing purity and forgiveness, ideal for new beginnings.',
        categories: ['Bouquets', 'Tulips']
    },
    {
        id: '4',
        name: 'Blue Roses',
        price: '110 AZN',
        image: require('../assets/images/blue_roses2.jpg'),
        description: 'Rare and stunning blue roses that mesmerize with their unique beauty.',
        categories: ['Roses', 'Bouquets']
    },
    {
        id: '5',
        name: 'Pink Tulips',
        price: '60 AZN',
        image: require('../assets/images/pink_tulips.jpg'),
        description: 'Beautiful soft pink tulips, perfectly arranged to bring warmth and happiness.',
        categories: ['Tulips', 'Bouquets']
    },
    {
        id: '6',
        name: 'Orchid',
        price: '75 AZN',
        image: require('../assets/images/orchid.jpg'),
        description: 'Exquisite pink orchid plant, a symbol of luxury and exotic beauty.',
        categories: []
    },
    {
        id: '7',
        name: 'Pink Lily',
        price: '70 AZN',
        image: require('../assets/images/pink_lily.jpg'),
        description: 'A beautiful bouquet featuring stunning pink lilies, perfect for any special occasion.',
        categories: ['Bouquets']
    },
    {
        id: '8',
        name: 'Purple Tulips',
        price: '120 AZN',
        image: require('../assets/images/purple_tulips.jpg'),
        description: 'Breathtaking purple tulips representing royalty and admiration, an elegant choice.',
        categories: ['Bouquets', 'Tulips']
    },
    {
        id: '9',
        name: 'Red Roses',
        price: '70 AZN',
        image: require('../assets/images/red_roses.jpg'),
        description: 'A stunning arrangement of beautiful deep red roses, the ultimate symbol of love and passion.',
        categories: ['Roses', 'Bouquets']
    },
    {
        id: '10',
        name: 'Red Tulips',
        price: '80 AZN',
        image: require('../assets/images/red_tulips2.jpg'),
        description: 'Brilliant red tulips that signify deep love and affection.',
        categories: ['Bouquets', 'Tulips']
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

export interface Order {
    id: string;
    date: string;
    status: string;
    items: number;
    total: string;
}

interface AppState {
    userName: string;
    userEmail: string;
    favorites: string[];
    products: Product[];
    cart: CartItem[];
    orders: Order[];
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
    addOrder: (order: Order) => void;
    setOrders: (orders: Order[]) => void;
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
    orders: [],
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

    addOrder: (order: Order) => set((state) => ({
        orders: [order, ...state.orders]
    })),

    setOrders: (orders: Order[]) => set({ orders }),

    toggleDarkMode: (value: boolean) => set({ isDarkMode: value })
}));
